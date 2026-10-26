#!/usr/bin/env bash
# =============================================================================
# AegisAI - read-only readiness report for Cloud Run (Argolis-aware).
# Changes NOTHING. Safe to run any time.
#   scripts/argolis/preflight.sh            # uses scripts/argolis/config.env
# =============================================================================
set -uo pipefail
# shellcheck source=common.sh
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
require_cmds gcloud curl python3
load_config

section "Settings"
info "Config file:      $AEGIS_CONFIG_FILE"
info "Project / region: $PROJECT_ID / $REGION"
info "Service:          $SERVICE_NAME (access mode: $ACCESS_MODE)"
info "Allowed domains:  ${ALLOWED_DOMAINS:-<none>}"
info "Firestore:        $FIRESTORE_DATABASE_ID ($FIRESTORE_LOCATION)"
info "Gemini:           Vertex AI, $GEMINI_MODEL @ $VERTEX_LOCATION"
info "Demo mode: $ENABLE_DEMO_MODE | Live Scanner ADC: $ENABLE_LIVE_SCANNER_ADC"

# -----------------------------------------------------------------------------
section "Identity"
acct="$(gcloud config get-value account 2>/dev/null)"
if [[ -n "$acct" ]]; then ok "gcloud account: $acct"; else bad "No active gcloud account (run: gcloud auth login)"; fi
if gcloud auth print-access-token >/dev/null 2>&1; then ok "gcloud credentials valid"; else bad "gcloud credentials invalid/expired (run: gcloud auth login)"; exit 1; fi
if gcloud auth application-default print-access-token >/dev/null 2>&1; then
  ok "Application Default Credentials present (used only for local runs)"
else
  warn "No ADC (only needed to run the server locally: gcloud auth application-default login)"
fi
[[ -n "$ALLOWED_DOMAINS" ]] || bad "ALLOWED_DOMAINS is empty"

# -----------------------------------------------------------------------------
section "Project"
pj="$(gcloud projects describe "$PROJECT_ID" --format=json 2>/dev/null)" || { bad "Cannot read project $PROJECT_ID"; exit 1; }
ok "Number $(json_get 'd["projectNumber"]' <<<"$pj"), state $(json_get 'd["lifecycleState"]' <<<"$pj"), parent $(json_get 'd.get("parent",{}).get("type","")+"/"+d.get("parent",{}).get("id","")' <<<"$pj")"
AEGIS_PROJECT_NUMBER="$(json_get 'd["projectNumber"]' <<<"$pj")"
if [[ "$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingEnabled)' 2>/dev/null)" == "True" ]]; then
  ok "Billing enabled"
else
  bad "Billing not enabled (or no permission to check)"
fi

# -----------------------------------------------------------------------------
section "APIs"
required_apis=(run cloudbuild artifactregistry aiplatform firestore firebase identitytoolkit secretmanager firebaserules)
[[ "$ACCESS_MODE" == "iap" ]] && required_apis+=(iap)
enabled="$(gcloud services list --enabled --project "$PROJECT_ID" --format='value(config.name)' 2>/dev/null)"
missing=()
for a in "${required_apis[@]}"; do grep -qx "$a.googleapis.com" <<<"$enabled" || missing+=("$a.googleapis.com"); done
if ((${#missing[@]})); then warn "Not enabled yet (bootstrap.sh enables them): ${missing[*]}"; else ok "All required APIs are enabled"; fi

# -----------------------------------------------------------------------------
section "Organization policies (effective on the project)"
policy() { gcloud resource-manager org-policies describe "constraints/$1" --project="$PROJECT_ID" --effective --format=json 2>/dev/null; }
drs="$(policy iam.allowedPolicyMemberDomains | json_get 'd.get("listPolicy",{}).get("allValues") or ("RESTRICTED" if d.get("listPolicy") else "NOT_SET")')"
case "$drs" in
  ALLOW|NOT_SET) ok "Domain restricted sharing: open (principals outside your org, e.g. domain:google.com, can be granted)";;
  *) if [[ "$ACCESS_MODE" == "iap" ]]; then
       warn "Domain restricted sharing is enforced: IAP grants for domains outside your org will be rejected unless their customer IDs are allowed"
     else
       ok "Domain restricted sharing enforced (fine for ACCESS_MODE=public, which uses --no-invoker-iam-check)"
     fi;;
esac
bool_policy() { policy "$1" | json_get 'd.get("booleanPolicy",{}).get("enforced", False)'; }
[[ "$(bool_policy iam.automaticIamGrantsForDefaultServiceAccounts)" == "True" ]] \
  && ok "Default service accounts get no automatic roles -> dedicated SAs with explicit roles (bootstrap.sh)" \
  || info "Default service accounts may hold automatic Editor grants (not used by this deployment)"
[[ "$(bool_policy iam.disableServiceAccountKeyCreation)" == "True" ]] \
  && ok "Service-account key creation blocked -> this deployment is keyless (ADC)" \
  || info "Service-account keys allowed (not needed by this deployment)"
loc="$(policy gcp.resourceLocations | json_get 'd.get("listPolicy",{}).get("allValues") or ("RESTRICTED" if d.get("listPolicy") else "NOT_SET")')"
if [[ "$loc" == "ALLOW" || "$loc" == "NOT_SET" ]]; then ok "Resource locations unrestricted"; else warn "Resource locations restricted: confirm $REGION and $FIRESTORE_LOCATION are allowed"; fi
info "Compute Engine VM constraints (Shielded VM, external IPs) do not affect Cloud Run."

# -----------------------------------------------------------------------------
section "Firebase"
fbp="$(api GET "https://firebase.googleapis.com/v1beta1/projects/$PROJECT_ID")"
if [[ "$(json_get 'd.get("state","")' <<<"$fbp")" == "ACTIVE" ]]; then
  ok "Firebase linked (display name: $(json_get 'd.get("displayName","")' <<<"$fbp"))"
else
  bad "Firebase is not enabled on this project (Firebase console > Add project > select $PROJECT_ID)"
fi
apps="$(api GET "https://firebase.googleapis.com/v1beta1/projects/$PROJECT_ID/webApps" | json_get '[a["appId"] for a in d.get("apps",[]) if a.get("state")=="ACTIVE"]')"
cfg_file="$(firebase_config_file)"
cfg_project="$(json_get 'd.get("projectId","")' <"$cfg_file")"
cfg_app="$(json_get 'd.get("appId","")' <"$cfg_file")"
cfg_db="$(json_get 'd.get("firestoreDatabaseId","(default)")' <"$cfg_file")"
info "Web config bundled by the build: ${cfg_file#"$AEGIS_ROOT"/}"
[[ "$cfg_project" == "$PROJECT_ID" ]] && ok "Web config projectId = $PROJECT_ID" || bad "Web config projectId is '$cfg_project' (expected $PROJECT_ID; bootstrap.sh can regenerate it)"
grep -qF "\"$cfg_app\"" <<<"$apps" && ok "Web config appId is a registered web app" || bad "Web config appId '$cfg_app' is not an active web app of $PROJECT_ID"
[[ "$cfg_db" == "$FIRESTORE_DATABASE_ID" ]] && ok "Web config firestoreDatabaseId = $FIRESTORE_DATABASE_ID" || bad "Web config firestoreDatabaseId is '$cfg_db' (expected $FIRESTORE_DATABASE_ID)"

# Only selected fields are extracted: the Auth config also contains password-hash parameters.
auth="$(api GET "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/config" | json_get '{"domains": d.get("authorizedDomains", []), "email": d.get("signIn",{}).get("email",{}).get("enabled", False), "anonymous": d.get("signIn",{}).get("anonymous",{}).get("enabled", False)}')"
google_idp="$(api GET "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/defaultSupportedIdpConfigs/google.com" | json_get 'd.get("enabled", False)')"
[[ "$google_idp" == "True" ]] && ok "Firebase Auth: Google sign-in provider enabled" || bad "Firebase Auth: Google provider not enabled (Firebase console > Authentication > Sign-in method > Google)"
[[ "$(json_get 'd["email"]' <<<"$auth")" == "True" ]] && warn "Email/password sign-in is enabled (not used by AegisAI; consider disabling)"
[[ "$(json_get 'd["anonymous"]' <<<"$auth")" == "True" ]] && warn "Anonymous sign-in is enabled (not used by AegisAI; disable it)"
auth_domains="$(json_get '"\n".join(d["domains"])' <<<"$auth")"
info "Authorized domains: $(tr '\n' ' ' <<<"$auth_domains")"
for stray in google.com cloudshell.dev; do
  grep -qx "$stray" <<<"$auth_domains" && warn "Authorized domains contains '$stray' (hosting origins only - not user email domains; remove it)"
done

# -----------------------------------------------------------------------------
section "Firestore"
dbj="$(gcloud firestore databases describe --database="$FIRESTORE_DATABASE_ID" --project "$PROJECT_ID" --format=json 2>/dev/null)"
if [[ -n "$dbj" ]]; then
  ok "Database $FIRESTORE_DATABASE_ID: $(json_get 'd.get("type","")' <<<"$dbj") in $(json_get 'd.get("locationId","")' <<<"$dbj")"
else
  warn "Database $FIRESTORE_DATABASE_ID not found (bootstrap.sh creates it in $FIRESTORE_LOCATION)"
fi
rel="$(api GET "https://firebaserules.googleapis.com/v1/projects/$PROJECT_ID/releases/$(rules_release_name)")"
ruleset="$(json_get 'd.get("rulesetName","")' <<<"$rel")"
if [[ -z "$ruleset" ]]; then
  warn "No security rules released for $FIRESTORE_DATABASE_ID yet (deploy_cloud_run.sh publishes firestore.rules)"
else
  deployed="$(api GET "https://firebaserules.googleapis.com/v1/$ruleset" | json_get 'd["source"]["files"][0]["content"]')"
  if diff -q <(printf '%s\n' "$deployed" | tr -d '\r') <(tr -d '\r' <"$AEGIS_ROOT/firestore.rules") >/dev/null 2>&1; then
    ok "Deployed rules match firestore.rules"
  else
    warn "Deployed rules differ from firestore.rules (deploy_cloud_run.sh will publish the repo version)"
  fi
fi
rules_cover_domains && ok "firestore.rules covers ALLOWED_DOMAINS"

# -----------------------------------------------------------------------------
section "Service accounts & secrets"
if service_account_exists "$BUILD_SA"; then
  roles="$(project_roles_of "serviceAccount:$BUILD_SA")"
  grep -qx "roles/cloudbuild.builds.builder" <<<"$roles" && ok "Build SA $BUILD_SA_NAME ready" || warn "Build SA lacks roles/cloudbuild.builds.builder (run bootstrap.sh)"
else
  warn "Build SA $BUILD_SA_NAME missing (bootstrap.sh creates it)"
fi
if service_account_exists "$RUNNER_SA"; then
  roles="$(project_roles_of "serviceAccount:$RUNNER_SA")"
  for r in roles/aiplatform.user roles/datastore.user; do
    grep -qx "$r" <<<"$roles" && ok "Runtime SA has $r" || warn "Runtime SA lacks $r (run bootstrap.sh)"
  done
  if grep -qx "roles/viewer" <<<"$roles" && [[ "$ENABLE_LIVE_SCANNER_ADC" != "true" ]]; then
    warn "Runtime SA has roles/viewer but the Live Scanner ADC mode is off (bootstrap.sh --prune-legacy-roles removes it)"
  fi
else
  warn "Runtime SA $RUNNER_SA_NAME missing (bootstrap.sh creates it)"
fi
compute_sa="$(project_number)-compute@developer.gserviceaccount.com"
broad="$(project_roles_of "serviceAccount:$compute_sa" | grep -E 'roles/(storage\.admin|artifactregistry\.admin|editor|owner)' | tr '\n' ' ')"
[[ -n "$broad" ]] && warn "Default Compute SA holds broad roles: $broad(bootstrap.sh --prune-legacy-roles removes them)"
if gcloud secrets describe "$ADMIN_TOKEN_SECRET" --project "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Secret $ADMIN_TOKEN_SECRET exists"
else
  warn "Secret $ADMIN_TOKEN_SECRET missing (bootstrap.sh generates it)"
fi
if gcloud artifacts repositories describe "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID" >/dev/null 2>&1; then
  ok "Artifact Registry repo $REPO_NAME ($REGION)"
else
  warn "Artifact Registry repo $REPO_NAME missing in $REGION (bootstrap.sh creates it)"
fi

# -----------------------------------------------------------------------------
section "Cloud Run service"
svc="$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format=json 2>/dev/null)"
if [[ -z "$svc" ]]; then
  info "Service $SERVICE_NAME does not exist yet (deploy_cloud_run.sh creates it)"
else
  info "Runtime SA: $(json_get 'd["spec"]["template"]["spec"].get("serviceAccountName","")' <<<"$svc")"
  info "IAP enabled: $(json_get 'd["metadata"].get("annotations",{}).get("run.googleapis.com/iap-enabled","false")' <<<"$svc") | invoker IAM check disabled: $(json_get 'd["metadata"].get("annotations",{}).get("run.googleapis.com/invoker-iam-disabled","false")' <<<"$svc")"
  while read -r h; do
    [[ -z "$h" ]] && continue
    grep -qx "$h" <<<"$auth_domains" && ok "Authorized domain present: $h" || warn "Authorized domain missing: $h (deploy_cloud_run.sh adds it)"
  done < <(service_hosts)
fi

# -----------------------------------------------------------------------------
section "Summary"
if ((AEGIS_FAILURES > 0)); then
  printf '   %s%d blocking issue(s)%s, %d warning(s). Fix the ✘ items first.\n' "$C_RED" "$AEGIS_FAILURES" "$C_OFF" "$AEGIS_WARNINGS"
  exit 1
fi
printf '   %sNo blocking issues%s, %d warning(s). Next: scripts/argolis/bootstrap.sh, then ./deploy_cloud_run.sh\n' "$C_GRN" "$C_OFF" "$AEGIS_WARNINGS"
