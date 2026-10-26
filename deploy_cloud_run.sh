#!/usr/bin/env bash
# =============================================================================
# AegisAI - build and deploy to Google Cloud Run (Argolis-ready).
#
# One-time prerequisite per project:  scripts/argolis/bootstrap.sh
# Read-only check at any time:        scripts/argolis/preflight.sh
# Settings: scripts/argolis/config.env (see config.env.example). Environment variables override it:
#   ./deploy_cloud_run.sh                        # build image, publish Firestore rules, deploy, configure access
#   ACCESS_MODE=public ./deploy_cloud_run.sh     # open URL; access controlled by the app's Google sign-in only
#   SKIP_BUILD=1 ./deploy_cloud_run.sh           # redeploy the current image (or IMAGE=<url>)
#   SKIP_RULES=1 ./deploy_cloud_run.sh           # leave the published Firestore rules untouched
#   RULES_ONLY=1 ./deploy_cloud_run.sh           # only publish firestore.rules (no build/deploy)
#   ./deploy_cloud_run.sh my-project-id          # first argument overrides PROJECT_ID
#
# What it does (idempotent):
#   1. Cloud Build (as the dedicated build SA) with the frontend's build-time settings
#   2. Publishes firestore.rules to the app's Firestore database (Firebase Rules API)
#   3. Deploys Cloud Run: runtime SA, Vertex AI env (no API keys), admin token from Secret Manager
#   4. Access: IAP limited to ALLOWED_DOMAINS (or --no-invoker-iam-check in public mode)
#   5. Adds the service hostnames to Firebase Auth "Authorized domains"
#   6. Smoke test
# =============================================================================
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
# shellcheck source=scripts/argolis/common.sh
source scripts/argolis/common.sh
require_cmds gcloud curl python3

if [[ -n "${1:-}" ]]; then PROJECT_ID="$1"; fi
load_config
PNUM="$(project_number)"
[[ -n "$PNUM" ]] || die "Cannot read project $PROJECT_ID (check gcloud auth / PROJECT_ID)."

TAG="$(date -u +%Y%m%d-%H%M%S)"
if [[ "${RULES_ONLY:-}" == "1" ]]; then
  SKIP_BUILD=1
  IMAGE="${IMAGE:-(not deployed: RULES_ONLY=1)}"
elif [[ "${SKIP_BUILD:-}" == "1" ]]; then
  : "${IMAGE:=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" \
      --format='value(spec.template.spec.containers[0].image)' 2>/dev/null)}"
  [[ -n "$IMAGE" ]] || die "SKIP_BUILD=1 needs IMAGE=<image-url> (no deployed image found)."
else
  IMAGE="${REGION}-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:$TAG"
fi

section "Deploy $SERVICE_NAME -> $PROJECT_ID ($REGION) | access: $ACCESS_MODE"
info "Allowed domains: $ALLOWED_DOMAINS"
info "Image:           $IMAGE"
info "Gemini:          Vertex AI $GEMINI_MODEL @ $VERTEX_LOCATION | Firestore: $FIRESTORE_DATABASE_ID"

# -----------------------------------------------------------------------------
section "0. Pre-checks"
[[ -n "$ALLOWED_DOMAINS" ]] || die "ALLOWED_DOMAINS is empty (scripts/argolis/config.env)."
cfg_file="$(firebase_config_file)"
[[ "$(json_get 'd.get("projectId","")' <"$cfg_file")" == "$PROJECT_ID" ]] \
  || die "${cfg_file##*/} targets another project. Run scripts/argolis/bootstrap.sh to regenerate it."
[[ "$(json_get 'd.get("firestoreDatabaseId","(default)")' <"$cfg_file")" == "$FIRESTORE_DATABASE_ID" ]] \
  || die "${cfg_file##*/} has a firestoreDatabaseId different from $FIRESTORE_DATABASE_ID."
ok "Firebase web config: ${cfg_file##*/}"
rules_cover_domains || die "firestore.rules must allow every domain in ALLOWED_DOMAINS."
ok "firestore.rules covers $ALLOWED_DOMAINS"
service_account_exists "$RUNNER_SA" || die "Runtime SA $RUNNER_SA_NAME missing. Run scripts/argolis/bootstrap.sh first."
gcloud secrets describe "$ADMIN_TOKEN_SECRET" --project "$PROJECT_ID" >/dev/null 2>&1 \
  || die "Secret $ADMIN_TOKEN_SECRET missing. Run scripts/argolis/bootstrap.sh first."
ok "Runtime service account and admin secret present"

# -----------------------------------------------------------------------------
if [[ "${SKIP_BUILD:-}" == "1" ]]; then
  section "1. Build (skipped)"
else
  section "1. Build with Cloud Build (as $BUILD_SA_NAME)"
  service_account_exists "$BUILD_SA" || die "Build SA $BUILD_SA_NAME missing. Run scripts/argolis/bootstrap.sh first."
  # '^##^' switches the substitution delimiter so ALLOWED_DOMAINS can contain commas.
  gcloud builds submit . --project "$PROJECT_ID" --region "$REGION" --config cloudbuild.yaml \
    --service-account "projects/$PROJECT_ID/serviceAccounts/$BUILD_SA" \
    --substitutions "^##^_REGION=$REGION##_REPO=$REPO_NAME##_SERVICE=$SERVICE_NAME##_TAG=$TAG##_ALLOWED_DOMAINS=$ALLOWED_DOMAINS##_ENABLE_DEMO_MODE=$ENABLE_DEMO_MODE"
  ok "Image pushed: $IMAGE"
fi

# -----------------------------------------------------------------------------
if [[ "${SKIP_RULES:-}" == "1" ]]; then
  section "2. Firestore rules (skipped)"
else
  section "2. Firestore rules -> $FIRESTORE_DATABASE_ID"
  body="$(python3 -c 'import json,sys; print(json.dumps({"source":{"files":[{"name":"firestore.rules","content":open(sys.argv[1]).read()}]}}))' firestore.rules)"
  resp="$(api POST "https://firebaserules.googleapis.com/v1/projects/$PROJECT_ID/rulesets" "$body")"
  ruleset="$(json_get 'd.get("name","")' <<<"$resp")"
  [[ -n "$ruleset" ]] || die "firestore.rules was rejected: $(json_get 'd.get("error",{}).get("message","") or d' <<<"$resp")"
  rel_name="projects/$PROJECT_ID/releases/$(rules_release_name)"
  body="$(python3 -c 'import json,sys; print(json.dumps({"release":{"name":sys.argv[1],"rulesetName":sys.argv[2]}}))' "$rel_name" "$ruleset")"
  resp="$(api PATCH "https://firebaserules.googleapis.com/v1/$rel_name" "$body")"
  if [[ "$(json_get 'd.get("error",{}).get("code","")' <<<"$resp")" == "404" ]]; then
    body="$(python3 -c 'import json,sys; print(json.dumps({"name":sys.argv[1],"rulesetName":sys.argv[2]}))' "$rel_name" "$ruleset")"
    resp="$(api POST "https://firebaserules.googleapis.com/v1/projects/$PROJECT_ID/releases" "$body")"
  fi
  [[ "$(json_get 'd.get("rulesetName","")' <<<"$resp")" == "$ruleset" ]] \
    || die "Could not release the rules: $(json_get 'd.get("error",{}).get("message","") or d' <<<"$resp")"
  ok "Published firestore.rules (${ruleset##*/})"
fi
if [[ "${RULES_ONLY:-}" == "1" ]]; then
  [[ "${SKIP_RULES:-}" == "1" ]] && die "RULES_ONLY=1 and SKIP_RULES=1 together do nothing."
  ok "RULES_ONLY=1: rules published; Cloud Run left unchanged."
  exit 0
fi

# -----------------------------------------------------------------------------
section "3. Cloud Run deploy"
env_vars="^##^NODE_ENV=production##GOOGLE_GENAI_USE_ENTERPRISE=true##GOOGLE_CLOUD_PROJECT=$PROJECT_ID##GOOGLE_CLOUD_LOCATION=$VERTEX_LOCATION##GEMINI_MODEL=$GEMINI_MODEL##FIRESTORE_DATABASE_ID=$FIRESTORE_DATABASE_ID##ENABLE_LIVE_SCANNER_ADC=$ENABLE_LIVE_SCANNER_ADC"
if [[ "$ACCESS_MODE" == "iap" ]]; then
  access_flags=(--iap --no-allow-unauthenticated --invoker-iam-check)
else
  access_flags=(--no-iap --no-invoker-iam-check)
fi
vpc_flags=()
if [[ -n "${VPC_CONNECTOR:-}" ]]; then
  vpc_flags+=(--vpc-connector "$VPC_CONNECTOR" --vpc-egress "${VPC_EGRESS:-private-ranges-only}")
fi
# --max-instances 1: runtime cache lives in /tmp/aegis-runtime-cache (with Firestore system_config backing).
# --no-cpu-throttling: /api/v1/audits keeps working after its 202 response.
gcloud run deploy "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --image "$IMAGE" \
  --service-account "$RUNNER_SA" \
  --port 8080 --cpu 2 --memory 2Gi --timeout 3600 --concurrency 40 \
  --min-instances 0 --max-instances 1 --no-cpu-throttling --cpu-boost \
  --set-env-vars "$env_vars" \
  --set-secrets "ADMIN_API_TOKEN=${ADMIN_TOKEN_SECRET}:latest" \
  "${access_flags[@]}" \
  "${vpc_flags[@]}"
ok "Revision deployed"

# -----------------------------------------------------------------------------
NEED_IAP_OAUTH_STEP=false
if [[ "$ACCESS_MODE" == "iap" ]]; then
  section "4. Access: Identity-Aware Proxy (${ALLOWED_DOMAINS})"
  iap_agent="service-$PNUM@gcp-sa-iap.iam.gserviceaccount.com"
  if gcloud run services add-iam-policy-binding "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" \
       --member "serviceAccount:$iap_agent" --role roles/run.invoker >/dev/null 2>&1; then
    ok "IAP service agent can invoke the service"
  else
    bad "Could not grant roles/run.invoker to $iap_agent"
  fi
  while read -r d; do
    if out="$(gcloud iap web add-iam-policy-binding --project "$PROJECT_ID" --resource-type=cloud-run \
                --service="$SERVICE_NAME" --region="$REGION" --member="domain:$d" \
                --role=roles/iap.httpsResourceAccessor 2>&1 >/dev/null)"; then
      ok "IAP access granted to domain:$d"
    else
      warn "IAP access for domain:$d failed: $(tail -n 1 <<<"$out")"
      NEED_IAP_OAUTH_STEP=true
    fi
  done < <(allowed_domains_list)
  # Users are now authenticated by IAP; drop direct invoker grants to people left by older deploys.
  legacy="$(gcloud run services get-iam-policy "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format=json 2>/dev/null \
    | python3 -c 'import json,sys
d=json.load(sys.stdin)
for b in d.get("bindings",[]):
    if b["role"]=="roles/run.invoker":
        for m in b["members"]:
            if m.split(":")[0] in ("user","group","domain","allUsers","allAuthenticatedUsers"): print(m)')"
  for m in $legacy; do
    gcloud run services remove-iam-policy-binding "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" \
      --member "$m" --role roles/run.invoker >/dev/null 2>&1 && ok "Removed legacy direct invoker grant: $m"
  done
  # IAP's default (Google-managed) OAuth client only signs in identities from this organization.
  # Domains outside it (e.g. google.com) need a custom OAuth client, which can only be created in the console.
  org_id="$(gcloud projects get-ancestors "$PROJECT_ID" --format='value(id,type)' 2>/dev/null | awk '$2=="organization"{print $1}' || true)"
  org_domain="$( [[ -n "$org_id" ]] && gcloud organizations describe "$org_id" --format='value(displayName)' 2>/dev/null || true)"
  external="$(allowed_domains_list | grep -vxF -- "${org_domain:-__none__}" | tr '\n' ' ' || true)"
  custom_client="$(gcloud iap settings get --project "$PROJECT_ID" --resource-type=cloud-run --service="$SERVICE_NAME" \
                     --region="$REGION" --format='value(accessSettings.oauthSettings.clientId)' 2>/dev/null || true)"
  [[ -z "$custom_client" ]] && custom_client="$(gcloud iap settings get --project "$PROJECT_ID" \
                     --format='value(accessSettings.oauthSettings.clientId)' 2>/dev/null || true)"
  if [[ -z "$custom_client" ]]; then
    # Clients configured in the console may not be reported by the settings API: read the client_id from IAP's
    # sign-in redirect instead. A client owned by this project (prefix "<project number>-") is a custom client.
    svc_url="$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format='value(status.url)' 2>/dev/null || true)"
    redirect_client="$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 20 "$svc_url/" 2>/dev/null \
                       | python3 -c 'import sys,urllib.parse as u; print((u.parse_qs(u.urlparse(sys.stdin.read().strip()).query).get("client_id") or [""])[0])' || true)"
    [[ "$redirect_client" == "$PNUM-"* ]] && custom_client="$redirect_client"
  fi
  if [[ -n "${external// /}" && -z "$custom_client" ]]; then
    warn "IAP has no custom OAuth client yet: users from $external(outside ${org_domain:-your organization}) cannot sign in until the one-time console step below is done."
    NEED_IAP_OAUTH_STEP=true
  elif [[ -n "${external// /}" ]]; then
    ok "Custom IAP OAuth client configured (domains outside the organization can sign in)"
  fi
else
  section "4. Access: public URL (invoker IAM check disabled; app-level sign-in only)"
  warn "Anyone can reach the URL; only the in-app Google sign-in and Firestore rules restrict access."
fi

# -----------------------------------------------------------------------------
section "5. Firebase Auth authorized domains"
hosts="$(service_hosts)"
cfg_json="$(api GET "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/config")"
# Only authorizedDomains is read/written; the rest of the Auth config is never printed.
plan="$(printf '%s' "$cfg_json" | python3 -c 'import json,sys
d=json.load(sys.stdin); cur=d.get("authorizedDomains",[]); add=[h for h in sys.argv[1:] if h and h not in cur]
print(json.dumps({"add":add,"body":{"authorizedDomains":cur+add}}))' $hosts)"
unset cfg_json
to_add="$(json_get '" ".join(d["add"])' <<<"$plan")"
if [[ -z "$to_add" ]]; then
  ok "Already authorized: $(tr '\n' ' ' <<<"$hosts")"
else
  resp="$(api PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/config?updateMask=authorizedDomains" "$(json_get 'd["body"]' <<<"$plan")")"
  if [[ -n "$(json_get 'd.get("error",{}).get("message","")' <<<"$resp")" ]]; then
    bad "Could not update authorized domains: $(json_get 'd["error"]["message"]' <<<"$resp")"
  else
    ok "Added: $to_add"
  fi
fi

# -----------------------------------------------------------------------------
section "6. Smoke test"
url="$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format='value(status.url)')"
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$url/api/health" || true)"
if [[ "$ACCESS_MODE" == "iap" ]]; then
  if [[ "$code" =~ ^(302|401|403)$ ]]; then ok "Anonymous request is stopped by IAP (HTTP $code)"; else warn "Expected IAP to block anonymous requests, got HTTP $code"; fi
else
  if [[ "$code" == "200" ]]; then ok "GET /api/health -> 200"; else warn "GET /api/health -> HTTP $code"; fi
fi

section "Result"
info "URLs: $(tr '\n' ' ' <<<"$hosts" | sed -E 's#([^ ]+)#https://\1#g')"
info "Admin panel token: gcloud secrets versions access latest --secret $ADMIN_TOKEN_SECRET --project $PROJECT_ID"
if [[ "$ACCESS_MODE" == "iap" ]]; then
  info "Users from ${ALLOWED_DOMAINS//,/ and } sign in twice: IAP first, then the app's Google button."
  if [[ "$NEED_IAP_OAUTH_STEP" == "true" ]]; then
    warn "One-time console step needed for domains outside your organization (e.g. google.com):"
    info "  1) Google Auth Platform > Audience: User type 'External', publishing status 'In production'."
    info "  2) Cloud Run > $SERVICE_NAME > Security > Identity-Aware Proxy > Configure in IAP > OAuth configuration:"
    info "     'Custom OAuth' > Auto generate credentials (or a Web client with redirect URI"
    info "     https://iap.googleapis.com/v1/oauth/clientIds/CLIENT_ID:handleRedirect) > Save."
  fi
fi
if ((AEGIS_FAILURES > 0)); then die "$AEGIS_FAILURES step(s) failed - see the ✘ lines above."; fi
ok "Done ($AEGIS_WARNINGS warning(s))."
