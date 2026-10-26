#!/usr/bin/env bash
# =============================================================================
# AegisAI - one-time, idempotent Google Cloud setup (Argolis-aware).
#
# Additive only: enables APIs, creates the dedicated build/runtime service accounts and grants
# their roles, generates the admin-token secret, and creates the Firestore database and the
# Firebase web config file if they are missing. Safe to re-run.
#
# It removes nothing unless you pass --prune-legacy-roles (asks for confirmation; add --yes to skip):
#   - broad roles an older deploy script granted to the default Compute Engine service account
#   - roles/viewer on the runtime SA when the Live Scanner ADC mode is disabled
#
#   scripts/argolis/bootstrap.sh [--prune-legacy-roles] [--yes]
# =============================================================================
set -euo pipefail
# shellcheck source=common.sh
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
require_cmds gcloud curl python3 openssl

PRUNE=false
ASSUME_YES=false
for arg in "$@"; do
  case "$arg" in
    --prune-legacy-roles) PRUNE=true ;;
    --yes|-y) ASSUME_YES=true ;;
    -h|--help) sed -n '2,15p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) die "Unknown option: $arg" ;;
  esac
done

load_config
PNUM="$(project_number)"
[[ -n "$PNUM" ]] || die "Cannot read project $PROJECT_ID (check gcloud auth and PROJECT_ID)."

ensure_sa() {  # ensure_sa NAME DISPLAY_NAME
  local email="$1@${PROJECT_ID}.iam.gserviceaccount.com"
  if service_account_exists "$email"; then
    ok "Service account $1 exists"
  else
    gcloud iam service-accounts create "$1" --project "$PROJECT_ID" --display-name "$2" >/dev/null
    ok "Created service account $1"
  fi
}

section "Bootstrap $PROJECT_ID (#$PNUM, $REGION) using $AEGIS_CONFIG_FILE"

# -----------------------------------------------------------------------------
section "1. APIs"
apis=(run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com aiplatform.googleapis.com
      firestore.googleapis.com firebase.googleapis.com identitytoolkit.googleapis.com
      secretmanager.googleapis.com firebaserules.googleapis.com)
[[ "$ACCESS_MODE" == "iap" ]] && apis+=(iap.googleapis.com)
gcloud services enable "${apis[@]}" --project "$PROJECT_ID"
ok "Enabled: ${apis[*]}"
if [[ "$ACCESS_MODE" == "iap" ]]; then
  if gcloud beta services identity create --service=iap.googleapis.com --project "$PROJECT_ID" >/dev/null 2>&1; then
    ok "IAP service agent ready: service-$PNUM@gcp-sa-iap.iam.gserviceaccount.com"
  else
    warn "Could not pre-create the IAP service agent (Cloud Run creates it when IAP is first enabled)"
  fi
fi

# -----------------------------------------------------------------------------
section "2. Artifact Registry ($REPO_NAME, $REGION)"
if gcloud artifacts repositories describe "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Repository exists"
else
  gcloud artifacts repositories create "$REPO_NAME" --repository-format=docker --location "$REGION" \
    --project "$PROJECT_ID" --description "AegisAI container images" >/dev/null
  ok "Created repository"
fi

# -----------------------------------------------------------------------------
# Argolis disables automatic grants to default service accounts, so builds run as a dedicated SA
# with only the roles they need.
section "3. Build service account ($BUILD_SA_NAME)"
ensure_sa "$BUILD_SA_NAME" "AegisAI Cloud Build"
grant_project_role "serviceAccount:$BUILD_SA" roles/cloudbuild.builds.builder
grant_project_role "serviceAccount:$BUILD_SA" roles/logging.logWriter
if gcloud artifacts repositories add-iam-policy-binding "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID" \
     --member "serviceAccount:$BUILD_SA" --role roles/artifactregistry.writer >/dev/null 2>&1; then
  ok "roles/artifactregistry.writer on $REPO_NAME -> $BUILD_SA_NAME"
else
  bad "Could not grant roles/artifactregistry.writer on $REPO_NAME"
fi

# -----------------------------------------------------------------------------
section "4. Runtime service account ($RUNNER_SA_NAME)"
ensure_sa "$RUNNER_SA_NAME" "AegisAI Cloud Run runtime"
grant_project_role "serviceAccount:$RUNNER_SA" roles/aiplatform.user   # Gemini on Vertex AI
grant_project_role "serviceAccount:$RUNNER_SA" roles/datastore.user    # Firestore via the Admin SDK
if [[ "$ENABLE_LIVE_SCANNER_ADC" == "true" ]]; then
  grant_project_role "serviceAccount:$RUNNER_SA" roles/viewer          # Live Scanner ADC mode (read-only inventory)
fi

# -----------------------------------------------------------------------------
section "5. Admin token secret ($ADMIN_TOKEN_SECRET)"
if gcloud secrets describe "$ADMIN_TOKEN_SECRET" --project "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Secret exists (value unchanged)"
else
  printf '%s' "$(openssl rand -hex 24)" | gcloud secrets create "$ADMIN_TOKEN_SECRET" --project "$PROJECT_ID" \
    --replication-policy=automatic --data-file=- >/dev/null
  ok "Created with a random 48-character token (not printed)"
fi
if gcloud secrets add-iam-policy-binding "$ADMIN_TOKEN_SECRET" --project "$PROJECT_ID" \
     --member "serviceAccount:$RUNNER_SA" --role roles/secretmanager.secretAccessor >/dev/null 2>&1; then
  ok "roles/secretmanager.secretAccessor on the secret -> $RUNNER_SA_NAME"
else
  bad "Could not grant secret access to $RUNNER_SA_NAME"
fi
info "Admin panel token: gcloud secrets versions access latest --secret $ADMIN_TOKEN_SECRET --project $PROJECT_ID"

# -----------------------------------------------------------------------------
section "6. Firestore database ($FIRESTORE_DATABASE_ID)"
if gcloud firestore databases describe --database="$FIRESTORE_DATABASE_ID" --project "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Database exists"
else
  gcloud firestore databases create --database="$FIRESTORE_DATABASE_ID" --location="$FIRESTORE_LOCATION" \
    --type=firestore-native --project "$PROJECT_ID" >/dev/null
  ok "Created $FIRESTORE_DATABASE_ID in $FIRESTORE_LOCATION"
fi

# -----------------------------------------------------------------------------
section "7. Firebase web config (firebase-applet-config.local.json)"
cfg="$AEGIS_ROOT/firebase-applet-config.local.json"
current=""
[[ -f "$cfg" ]] && current="$(json_get 'd.get("projectId","")' <"$cfg")"
if [[ "$current" == "$PROJECT_ID" ]]; then
  ok "Already targets $PROJECT_ID"
else
  if [[ "$(api GET "https://firebase.googleapis.com/v1beta1/projects/$PROJECT_ID" | json_get 'd.get("state","")')" != "ACTIVE" ]]; then
    die "Firebase is not enabled on $PROJECT_ID. Firebase console > Add project > select $PROJECT_ID, then re-run."
  fi
  app_id="$(api GET "https://firebase.googleapis.com/v1beta1/projects/$PROJECT_ID/webApps" \
    | json_get 'next((a["appId"] for a in d.get("apps", []) if a.get("state") == "ACTIVE"), "")')"
  [[ -n "$app_id" ]] || die "No Firebase web app in $PROJECT_ID. Firebase console > Project settings > Your apps > Add app (Web), then re-run."
  [[ -f "$cfg" ]] && cp "$cfg" "$cfg.bak" && info "Previous file saved as $(basename "$cfg").bak"
  api GET "https://firebase.googleapis.com/v1beta1/projects/$PROJECT_ID/webApps/$app_id/config" | python3 -c '
import json, sys
c = json.load(sys.stdin)
if "apiKey" not in c:
    sys.exit("Unexpected response from the Firebase Management API: %s" % c.get("error", c))
out = {k: c.get(k, "") for k in ("projectId", "appId", "apiKey", "authDomain", "storageBucket", "messagingSenderId", "measurementId")}
out["firestoreDatabaseId"] = sys.argv[2]
json.dump(out, open(sys.argv[1], "w"), indent=2)
' "$cfg" "$FIRESTORE_DATABASE_ID"
  ok "Wrote $(basename "$cfg") for web app $app_id (gitignored; bundled by the build)"
fi

# -----------------------------------------------------------------------------
section "8. Legacy roles"
compute_sa="$PNUM-compute@developer.gserviceaccount.com"
legacy_candidates=(roles/storage.admin roles/artifactregistry.admin roles/artifactregistry.writer roles/cloudbuild.builds.builder roles/logging.logWriter)
compute_roles="$(project_roles_of "serviceAccount:$compute_sa")"
to_prune=()
for r in "${legacy_candidates[@]}"; do grep -qx "$r" <<<"$compute_roles" && to_prune+=("serviceAccount:$compute_sa|$r"); done
if [[ "$ENABLE_LIVE_SCANNER_ADC" != "true" ]] && grep -qx "roles/viewer" <<<"$(project_roles_of "serviceAccount:$RUNNER_SA")"; then
  to_prune+=("serviceAccount:$RUNNER_SA|roles/viewer")
fi
if ((${#to_prune[@]} == 0)); then
  ok "Nothing to prune"
elif [[ "$PRUNE" != "true" ]]; then
  for item in "${to_prune[@]}"; do info "Could be removed: ${item#*|} from ${item%%|*}"; done
  info "Re-run with --prune-legacy-roles to remove them (only do this if nothing else in the project relies on them)."
else
  if [[ "$ASSUME_YES" != "true" ]]; then
    read -r -p "   Remove the roles listed above? [y/N] " answer </dev/tty
    [[ "$answer" =~ ^[Yy]$ ]] || { info "Skipped."; to_prune=(); }
  fi
  for item in "${to_prune[@]}"; do remove_project_role "${item%%|*}" "${item#*|}"; done
fi

section "Done"
if ((AEGIS_FAILURES > 0)); then
  die "$AEGIS_FAILURES step(s) failed - see the ✘ lines above."
fi
ok "Bootstrap complete ($AEGIS_WARNINGS warning(s)). Next: ./deploy_cloud_run.sh"
