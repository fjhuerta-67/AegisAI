#!/usr/bin/env bash
# Shared helpers for the AegisAI Google Cloud / Argolis deployment scripts.
# Source this file; do not execute it. Nothing here prints access tokens or secret values.

AEGIS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AEGIS_SCRIPTS="$AEGIS_ROOT/scripts/argolis"

if [[ -t 1 ]]; then
  C_RED=$'\033[0;31m'; C_GRN=$'\033[0;32m'; C_YLW=$'\033[1;33m'; C_BLU=$'\033[0;34m'; C_BLD=$'\033[1m'; C_OFF=$'\033[0m'
else
  C_RED=""; C_GRN=""; C_YLW=""; C_BLU=""; C_BLD=""; C_OFF=""
fi

AEGIS_WARNINGS=0
AEGIS_FAILURES=0
section() { printf '\n%s== %s ==%s\n' "$C_BLU$C_BLD" "$*" "$C_OFF"; }
info()    { printf '   %s\n' "$*"; }
ok()      { printf '   %s✔%s %s\n' "$C_GRN" "$C_OFF" "$*"; }
warn()    { printf '   %s⚠%s %s\n' "$C_YLW" "$C_OFF" "$*"; AEGIS_WARNINGS=$((AEGIS_WARNINGS + 1)); }
bad()     { printf '   %s✘%s %s\n' "$C_RED" "$C_OFF" "$*"; AEGIS_FAILURES=$((AEGIS_FAILURES + 1)); }
die()     { printf '\n%s✘ %s%s\n' "$C_RED" "$*" "$C_OFF" >&2; exit 1; }

require_cmds() {
  local c
  for c in "$@"; do command -v "$c" >/dev/null 2>&1 || die "Required command not found: $c"; done
}

AEGIS_CONFIG_KEYS=(PROJECT_ID REGION SERVICE_NAME REPO_NAME FIRESTORE_DATABASE_ID FIRESTORE_LOCATION
  ALLOWED_DOMAINS ACCESS_MODE GEMINI_MODEL VERTEX_LOCATION ENABLE_DEMO_MODE ENABLE_LIVE_SCANNER_ADC
  BUILD_SA_NAME RUNNER_SA_NAME ADMIN_TOKEN_SECRET)

# Loads scripts/argolis/config.env (or the file in $AEGIS_CONFIG). Variables already set in the
# environment take precedence over the file, so one-off overrides work: ACCESS_MODE=public ./deploy_cloud_run.sh
load_config() {
  local cfg="${AEGIS_CONFIG:-$AEGIS_SCRIPTS/config.env}" k p
  for k in "${AEGIS_CONFIG_KEYS[@]}"; do
    if [[ -n "${!k:-}" ]]; then printf -v "__AEGIS_PRESET_$k" '%s' "${!k}"; fi
  done
  if [[ -f "$cfg" ]]; then
    # shellcheck disable=SC1090
    source "$cfg"
    AEGIS_CONFIG_FILE="$cfg"
  else
    AEGIS_CONFIG_FILE="(none; using defaults - copy scripts/argolis/config.env.example to scripts/argolis/config.env)"
  fi
  for k in "${AEGIS_CONFIG_KEYS[@]}"; do
    p="__AEGIS_PRESET_$k"
    if [[ -n "${!p:-}" ]]; then printf -v "$k" '%s' "${!p}"; unset "$p"; fi
  done

  : "${PROJECT_ID:=$(gcloud config get-value project 2>/dev/null)}"
  : "${REGION:=us-central1}"
  : "${SERVICE_NAME:=aegis-ai}"
  : "${REPO_NAME:=cloud-run-source-deploy}"
  : "${FIRESTORE_DATABASE_ID:=aegis-ai-db}"
  : "${FIRESTORE_LOCATION:=nam5}"
  : "${ALLOWED_DOMAINS:=}"
  : "${ACCESS_MODE:=iap}"
  : "${GEMINI_MODEL:=gemini-3.8-flash}"
  : "${VERTEX_LOCATION:=global}"
  : "${ENABLE_DEMO_MODE:=false}"
  : "${ENABLE_LIVE_SCANNER_ADC:=false}"
  : "${BUILD_SA_NAME:=aegis-build-sa}"
  : "${RUNNER_SA_NAME:=aegis-runner-sa}"
  : "${ADMIN_TOKEN_SECRET:=aegis-admin-token}"

  [[ -n "$PROJECT_ID" && "$PROJECT_ID" != "(unset)" ]] || die "PROJECT_ID is not set (config.env, environment, or gcloud config)."
  [[ "$ACCESS_MODE" == "iap" || "$ACCESS_MODE" == "public" ]] || die "ACCESS_MODE must be 'iap' or 'public' (got '$ACCESS_MODE')."
  ALLOWED_DOMAINS="$(printf '%s' "$ALLOWED_DOMAINS" | tr -d ' ' | tr '[:upper:]' '[:lower:]')"
  BUILD_SA="${BUILD_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
  RUNNER_SA="${RUNNER_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
  export CLOUDSDK_CORE_DISABLE_PROMPTS=1
}

allowed_domains_list() { printf '%s\n' "$ALLOWED_DOMAINS" | tr ',' '\n' | sed '/^$/d'; }

project_number() {
  if [[ -z "${AEGIS_PROJECT_NUMBER:-}" ]]; then
    AEGIS_PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)' 2>/dev/null)"
  fi
  printf '%s' "$AEGIS_PROJECT_NUMBER"
}

# api METHOD URL [JSON_BODY] -> response body on stdout.
# The OAuth token goes to curl through stdin (-K -), so it never shows up in the process list or output.
api() {
  local method="$1" url="$2" body="${3:-}" token
  token="$(gcloud auth print-access-token 2>/dev/null)" || die "gcloud has no valid credentials. Run: gcloud auth login"
  local args=(-sS -X "$method" -H "x-goog-user-project: $PROJECT_ID" -H "Content-Type: application/json" -K -)
  if [[ -n "$body" ]]; then args+=(--data "$body"); fi
  printf 'header = "Authorization: Bearer %s"\n' "$token" | curl "${args[@]}" "$url"
}

# json_get EXPR: evaluates a Python expression over the JSON document on stdin (bound to `d`).
# Prints dicts/lists as JSON, None/errors as an empty string.
json_get() {
  python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    d = {}
try:
    v = eval(sys.argv[1], {"d": d})
except Exception:
    v = ""
if isinstance(v, (dict, list)):
    print(json.dumps(v))
elif v is None:
    print("")
else:
    print(v)
' "$1"
}

service_account_exists() { gcloud iam service-accounts describe "$1" --project "$PROJECT_ID" >/dev/null 2>&1; }

# project_roles_of MEMBER (e.g. serviceAccount:x@y) -> newline-separated project-level roles
project_roles_of() {
  gcloud projects get-iam-policy "$PROJECT_ID" --format=json 2>/dev/null | python3 -c '
import json, sys
m = sys.argv[1]
d = json.load(sys.stdin)
print("\n".join(sorted({b["role"] for b in d.get("bindings", []) if m in b.get("members", [])})))
' "$1"
}

grant_project_role() {  # grant_project_role MEMBER ROLE
  if gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="$1" --role="$2" --condition=None --quiet >/dev/null 2>&1; then
    ok "$2 -> ${1#*:}"
  else
    bad "Could not grant $2 to ${1#*:}"
  fi
}

remove_project_role() {  # remove_project_role MEMBER ROLE
  if gcloud projects remove-iam-policy-binding "$PROJECT_ID" --member="$1" --role="$2" --condition=None --quiet >/dev/null 2>&1; then
    ok "Removed $2 from ${1#*:}"
  else
    warn "Could not remove $2 from ${1#*:}"
  fi
}

# The Firebase web config bundled into the frontend (Vite prefers the .local.json override when present).
firebase_config_file() {
  if [[ -f "$AEGIS_ROOT/firebase-applet-config.local.json" ]]; then
    printf '%s' "$AEGIS_ROOT/firebase-applet-config.local.json"
  else
    printf '%s' "$AEGIS_ROOT/firebase-applet-config.json"
  fi
}

rules_release_name() {
  if [[ "$FIRESTORE_DATABASE_ID" == "(default)" ]]; then printf 'cloud.firestore'; else printf 'cloud.firestore/%s' "$FIRESTORE_DATABASE_ID"; fi
}

# Hostnames of the Cloud Run service (deterministic URL + legacy hash URL), one per line.
service_hosts() {
  gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format=json 2>/dev/null | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
urls = set()
if d.get("status", {}).get("url"):
    urls.add(d["status"]["url"])
try:
    urls.update(json.loads(d["metadata"]["annotations"].get("run.googleapis.com/urls", "[]")))
except Exception:
    pass
for u in sorted(urls):
    print(u.split("//", 1)[-1].split("/", 1)[0])
'
}

# Checks that firestore.rules admits every domain in ALLOWED_DOMAINS (rules can't read env vars).
rules_cover_domains() {
  local d missing=0 escaped
  while read -r d; do
    escaped="${d//./[.]}"
    if ! grep -qF -- "$escaped" "$AEGIS_ROOT/firestore.rules" && ! grep -qF -- "$d" "$AEGIS_ROOT/firestore.rules"; then
      bad "firestore.rules does not mention '$d' (update isAllowedUser() so its users can read/write data)"
      missing=1
    fi
  done < <(allowed_domains_list)
  return $missing
}
