#!/usr/bin/env bash
# End-to-end Sanctum cookie API verification for AI Company Brain
set -u
BASE="http://localhost:8000"
API="$BASE/api/v1"
ORIGIN="http://localhost:5173"
JAR="/tmp/acb_e2e_cookies.txt"
REPORT="/tmp/acb_e2e_report.txt"
: > "$JAR"
: > "$REPORT"

PASS=0; FAIL=0; WARN=0

record() {
  local status="$1" area="$2" check="$3" detail="${4:-}"
  printf '[%s] %s :: %s%s\n' "$status" "$area" "$check" "${detail:+ — $detail}" | tee -a "$REPORT"
  case "$status" in
    PASS) PASS=$((PASS+1));;
    FAIL) FAIL=$((FAIL+1));;
    WARN) WARN=$((WARN+1));;
  esac
}

csrf() {
  curl -sS -m 15 -c "$JAR" -b "$JAR" \
    -H "Origin: $ORIGIN" -H "Referer: $ORIGIN/" \
    -H "Accept: application/json" \
    "$BASE/sanctum/csrf-cookie" -o /dev/null -w "%{http_code}"
}

xsrf() {
  python3 - <<'PY'
from pathlib import Path
from urllib.parse import unquote
for line in Path("/tmp/acb_e2e_cookies.txt").read_text().splitlines():
    if line.startswith("#") or not line.strip():
        continue
    parts=line.split("\t")
    if len(parts)>=7 and parts[5]=="XSRF-TOKEN":
        print(unquote(parts[6]))
        break
PY
}

api() {
  local method="$1" path="$2"
  shift 2
  local token
  token="$(xsrf)"
  curl -sS -m 60 -c "$JAR" -b "$JAR" \
    -X "$method" \
    -H "Origin: $ORIGIN" -H "Referer: $ORIGIN/" \
    -H "Accept: application/json" \
    -H "X-Requested-With: XMLHttpRequest" \
    ${token:+ -H "X-XSRF-TOKEN: $token"} \
    "$@" \
    "$API$path"
}

http_code_only() {
  local method="$1" path="$2"
  shift 2
  local token
  token="$(xsrf)"
  curl -sS -m 60 -c "$JAR" -b "$JAR" -o /tmp/acb_e2e_body.json -w "%{http_code}" \
    -X "$method" \
    -H "Origin: $ORIGIN" -H "Referer: $ORIGIN/" \
    -H "Accept: application/json" \
    -H "X-Requested-With: XMLHttpRequest" \
    ${token:+ -H "X-XSRF-TOKEN: $token"} \
    "$@" \
    "$API$path"
}

json_field() {
  python3 - "$1" <<'PY'
import json,sys
path=sys.argv[1]
try:
    data=json.load(open("/tmp/acb_e2e_body.json"))
except Exception:
    print("")
    raise SystemExit
cur=data
for part in path.split("."):
    if part=="": continue
    if isinstance(cur, dict):
        cur=cur.get(part)
    elif isinstance(cur, list) and part.isdigit():
        cur=cur[int(part)] if int(part)<len(cur) else None
    else:
        cur=None
        break
if cur is None:
    print("")
elif isinstance(cur,(dict,list)):
    print(json.dumps(cur))
else:
    print(cur)
PY
}

first_id() {
  python3 <<'PY'
import json
try:
    data=json.load(open("/tmp/acb_e2e_body.json"))
except Exception:
    print(""); raise SystemExit
d=data.get("data")
if isinstance(d, list) and d:
    print(d[0].get("id",""))
elif isinstance(d, dict):
    if isinstance(d.get("data"), list) and d["data"]:
        print(d["data"][0].get("id",""))
    else:
        print(d.get("id",""))
else:
    print("")
PY
}

# --- Servers ---
code=$(curl -sS -m 5 -o /dev/null -w "%{http_code}" "$BASE/up" || echo 000)
[[ "$code" == "200" ]] && record PASS Servers "Laravel /up" "HTTP $code" || record FAIL Servers "Laravel /up" "HTTP $code"
code=$(curl -sS -m 5 -o /dev/null -w "%{http_code}" "http://localhost:5173/" || echo 000)
[[ "$code" == "200" ]] && record PASS Servers "Vite :5173" "HTTP $code" || record FAIL Servers "Vite :5173" "HTTP $code"

# --- Auth ---
ccode=$(csrf)
token="$(xsrf)"
if [[ -n "$token" ]]; then
  record PASS Auth "CSRF cookie" "HTTP $ccode"
else
  record FAIL Auth "CSRF cookie" "HTTP $ccode no XSRF-TOKEN"
fi

EMAIL="e2e.tester.$(date +%s)@example.com"
PASSWD="password123"
code=$(http_code_only POST /auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E Tester\",\"email\":\"$EMAIL\",\"password\":\"$PASSWD\",\"password_confirmation\":\"$PASSWD\"}")
if [[ "$code" == "200" || "$code" == "201" ]]; then
  record PASS Auth "Register new user" "HTTP $code email=$EMAIL"
  AUTH_MODE=register
else
  record WARN Auth "Register new user" "HTTP $code body=$(head -c 180 /tmp/acb_e2e_body.json)"
  EMAIL="ahsan@example.com"
  PASSWD="password"
  AUTH_MODE=seed
fi

if [[ "$AUTH_MODE" == "register" ]]; then
  code=$(http_code_only POST /auth/logout -H "Content-Type: application/json" -d '{}')
  [[ "$code" == "200" ]] && record PASS Auth "Logout after register" "HTTP $code" || record FAIL Auth "Logout after register" "HTTP $code"
  csrf >/dev/null
  code=$(http_code_only POST /auth/login -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"wrong-password\"}")
  [[ "$code" == "401" ]] && record PASS Auth "Wrong password returns 401" "HTTP $code" || record FAIL Auth "Wrong password returns 401" "HTTP $code"
  csrf >/dev/null
  code=$(http_code_only POST /auth/login -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWD\"}")
  [[ "$code" == "200" ]] && record PASS Auth "Login with correct password" "HTTP $code" || record FAIL Auth "Login with correct password" "HTTP $code $(head -c 120 /tmp/acb_e2e_body.json)"
else
  csrf >/dev/null
  code=$(http_code_only POST /auth/login -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"wrong-password\"}")
  [[ "$code" == "401" ]] && record PASS Auth "Wrong password returns 401" "HTTP $code" || record FAIL Auth "Wrong password returns 401" "HTTP $code"
  csrf >/dev/null
  code=$(http_code_only POST /auth/login -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWD\"}")
  [[ "$code" == "200" ]] && record PASS Auth "Login seeded Super Admin" "HTTP $code" || record FAIL Auth "Login seeded Super Admin" "HTTP $code $(head -c 160 /tmp/acb_e2e_body.json)"
fi

code=$(http_code_only GET /auth/me)
ME_ID=$(json_field data.id)
ME_NAME=$(json_field data.name)
[[ "$code" == "200" && -n "$ME_ID" ]] && record PASS Auth "Session /auth/me hydration" "id=$ME_ID name=$ME_NAME" || record FAIL Auth "Session /auth/me hydration" "HTTP $code"

# Unauthenticated me
code=$(curl -sS -m 10 -o /dev/null -w "%{http_code}" -H "Accept: application/json" -H "Origin: $ORIGIN" "$API/auth/me" || echo 000)
[[ "$code" == "401" || "$code" == "419" ]] && record PASS Auth "Unauthenticated /auth/me blocked" "HTTP $code" || record FAIL Auth "Unauthenticated /auth/me blocked" "HTTP $code"

# Helper macros
check_list() {
  local area="$1" path="$2" label="${3:-List}"
  local code
  code=$(http_code_only GET "$path")
  local id
  id=$(first_id)
  if [[ "$code" == "200" ]]; then
    record PASS "$area" "$label" "HTTP 200 id=${id:-none}"
  else
    record FAIL "$area" "$label" "HTTP $code $(head -c 120 /tmp/acb_e2e_body.json)"
  fi
  echo "$id"
}

check_get() {
  local area="$1" path="$2" label="$3"
  local code
  code=$(http_code_only GET "$path")
  [[ "$code" == "200" ]] && record PASS "$area" "$label" "HTTP $code" || record FAIL "$area" "$label" "HTTP $code $(head -c 140 /tmp/acb_e2e_body.json)"
}

check_mutate() {
  local area="$1" label="$2" method="$3" path="$4" json="$5"
  local code
  code=$(http_code_only "$method" "$path" -H "Content-Type: application/json" -d "$json")
  if [[ "$code" == "200" || "$code" == "201" ]]; then
    record PASS "$area" "$label" "HTTP $code"
  elif [[ "$code" == "403" || "$code" == "422" ]]; then
    record WARN "$area" "$label" "HTTP $code $(head -c 160 /tmp/acb_e2e_body.json)"
  else
    record FAIL "$area" "$label" "HTTP $code $(head -c 160 /tmp/acb_e2e_body.json)"
  fi
}

ORG_ID=$(check_list Organizations /organizations)
[[ -n "$ORG_ID" ]] && check_get Organizations "/organizations/$ORG_ID" Detail
[[ -n "$ORG_ID" ]] && check_mutate Organizations Update PATCH "/organizations/$ORG_ID" "{\"name\":\"$(json_field data.name | sed 's/"/\\"/g')\"}"
check_mutate Organizations Create POST /organizations "{\"name\":\"E2E Org $(date +%s)\",\"industry\":\"Technology\",\"size\":\"1-10\"}"

USER_ID=$(check_list Users /users)
[[ -z "$USER_ID" ]] && USER_ID="$ME_ID"
[[ -n "$USER_ID" ]] && check_get Users "/users/$USER_ID" Detail
[[ -n "$USER_ID" ]] && check_get Users "/users/$USER_ID/tasks" "User tasks"
[[ -n "$USER_ID" ]] && check_get Users "/users/$USER_ID/projects" "User projects"
check_mutate Users "Create/Invite" POST /users "{\"name\":\"E2E Invite\",\"email\":\"e2e.invite.$(date +%s)@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\",\"role\":\"Employee\",\"organization_id\":$ORG_ID}"
[[ -n "$USER_ID" ]] && check_mutate Users Update PATCH "/users/$USER_ID" "{\"name\":\"$(json_field data.name 2>/dev/null || echo User)\"}"

# refresh user name for update - re-get
http_code_only GET "/users/$USER_ID" >/dev/null
UNAME=$(json_field data.name)
[[ -n "$USER_ID" && -n "$UNAME" ]] && check_mutate Users "Update name" PATCH "/users/$USER_ID" "{\"name\":\"$UNAME\"}"

DEP_ID=$(check_list Departments /departments)
[[ -n "$DEP_ID" ]] && check_get Departments "/departments/$DEP_ID" Detail
[[ -n "$DEP_ID" ]] && check_get Departments "/departments/$DEP_ID/teams" "Teams section"
TEAM_FROM_DEP=$(first_id)
check_mutate Departments Create POST /departments "{\"name\":\"E2E Dept $(date +%s)\",\"organization_id\":$ORG_ID}"
http_code_only GET "/departments/$DEP_ID" >/dev/null
DNAME=$(json_field data.name)
[[ -n "$DEP_ID" && -n "$DNAME" ]] && check_mutate Departments Update PATCH "/departments/$DEP_ID" "{\"name\":\"$DNAME\"}"

TEAM_ID=$(check_list Teams /teams)
[[ -z "$TEAM_ID" ]] && TEAM_ID="$TEAM_FROM_DEP"
[[ -n "$TEAM_ID" ]] && check_get Teams "/teams/$TEAM_ID" Detail
check_mutate Teams Create POST /teams "{\"name\":\"E2E Team $(date +%s)\",\"department_id\":$DEP_ID,\"organization_id\":$ORG_ID}"
http_code_only GET "/teams/$TEAM_ID" >/dev/null
TNAME=$(json_field data.name)
[[ -n "$TEAM_ID" && -n "$TNAME" ]] && check_mutate Teams Update PATCH "/teams/$TEAM_ID" "{\"name\":\"$TNAME\"}"
if [[ -n "$DEP_ID" && -n "$TEAM_FROM_DEP" ]]; then
  c1=$(http_code_only GET "/teams/$TEAM_FROM_DEP")
  c2=$(http_code_only GET "/departments/$DEP_ID/teams")
  [[ "$c1" == "200" && "$c2" == "200" ]] && record PASS Cross-links "Department → Teams → Team Detail" || record FAIL Cross-links "Department → Teams → Team Detail" "$c1/$c2"
fi

PROJECT_ID=$(check_list Projects /projects)
[[ -n "$PROJECT_ID" ]] && check_get Projects "/projects/$PROJECT_ID" Detail
[[ -n "$PROJECT_ID" ]] && check_get Projects "/projects/$PROJECT_ID/tasks" "Tasks tab"
PROJECT_TASK_ID=$(first_id)
check_mutate Projects Create POST /projects "{\"name\":\"E2E Project $(date +%s)\",\"organization_id\":$ORG_ID,\"status\":\"planning\"}"
http_code_only GET "/projects/$PROJECT_ID" >/dev/null
PNAME=$(json_field data.name)
[[ -n "$PROJECT_ID" && -n "$PNAME" ]] && check_mutate Projects Update PATCH "/projects/$PROJECT_ID" "{\"name\":\"$PNAME\"}"

TASK_ID=$(check_list Tasks /tasks)
[[ -z "$TASK_ID" ]] && TASK_ID="$PROJECT_TASK_ID"
[[ -n "$TASK_ID" ]] && check_get Tasks "/tasks/$TASK_ID" Detail
check_mutate Tasks Create POST /tasks "{\"title\":\"E2E Task $(date +%s)\",\"project_id\":$PROJECT_ID,\"organization_id\":$ORG_ID,\"status\":\"todo\",\"priority\":\"medium\"}"
CREATED_TASK=$(json_field data.id)
TARGET_TASK=${CREATED_TASK:-$TASK_ID}
[[ -n "$TARGET_TASK" ]] && check_mutate Tasks "Update status" PATCH "/tasks/$TARGET_TASK/status" '{"status":"in_progress"}'
[[ -n "$TARGET_TASK" ]] && check_mutate Tasks "Create subtask" POST "/tasks/$TARGET_TASK/subtasks" '{"title":"E2E subtask"}'
[[ -n "$TARGET_TASK" ]] && check_get Tasks "/tasks/$TARGET_TASK/subtasks" "List subtasks"
[[ -n "$TARGET_TASK" ]] && check_mutate Tasks "Create comment" POST "/tasks/$TARGET_TASK/comments" '{"body":"E2E comment"}'
if [[ -n "$PROJECT_TASK_ID" ]]; then
  c=$(http_code_only GET "/tasks/$PROJECT_TASK_ID")
  [[ "$c" == "200" ]] && record PASS Cross-links "Project Tasks → Task detail resource" || record FAIL Cross-links "Project Tasks → Task detail resource" "HTTP $c"
fi

MEETING_ID=$(check_list Meetings /meetings)
[[ -n "$MEETING_ID" ]] && check_get Meetings "/meetings/$MEETING_ID" Detail
[[ -n "$MEETING_ID" ]] && check_mutate Meetings "Agenda item create" POST "/meetings/$MEETING_ID/agenda-items" '{"title":"E2E agenda"}'
if [[ -n "$MEETING_ID" && -n "$ME_ID" ]]; then
  check_mutate Meetings "RSVP update" PATCH "/meetings/$MEETING_ID/attendees/$ME_ID/rsvp" '{"rsvp_status":"accepted"}'
fi
check_mutate Meetings Create POST /meetings "{\"title\":\"E2E Meeting $(date +%s)\",\"organization_id\":$ORG_ID,\"starts_at\":\"2026-08-01T10:00:00.000000Z\",\"ends_at\":\"2026-08-01T11:00:00.000000Z\"}"
http_code_only GET "/meetings/$MEETING_ID" >/dev/null
MTITLE=$(json_field data.title)
[[ -n "$MEETING_ID" && -n "$MTITLE" ]] && check_mutate Meetings Update PATCH "/meetings/$MEETING_ID" "{\"title\":\"$MTITLE\"}"

check_list "Time Tracking" /time-entries
check_get "Time Tracking" /time-entries/reports/summary "Reports summary"
check_get "Time Tracking" /time-entries/reports/by-project "Reports by project"
check_get "Time Tracking" /time-entries/reports/by-user "Reports by user"
check_mutate "Time Tracking" "Manual entry create" POST /time-entries "{\"task_id\":$TARGET_TASK,\"project_id\":$PROJECT_ID,\"hours\":1.5,\"description\":\"E2E entry\",\"date\":\"2026-07-30\"}"

FOLDER_ID=$(check_list Files /folders)
[[ -n "$FOLDER_ID" ]] && check_get Files "/folders/$FOLDER_ID/contents" "Folder contents/navigation"
check_mutate Files "Create folder" POST /folders "{\"name\":\"E2E Folder $(date +%s)\",\"organization_id\":$ORG_ID}"
# upload
token="$(xsrf)"
code=$(curl -sS -m 60 -c "$JAR" -b "$JAR" -o /tmp/acb_e2e_body.json -w "%{http_code}" \
  -X POST "$API/files" \
  -H "Origin: $ORIGIN" -H "Referer: $ORIGIN/" -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  ${token:+ -H "X-XSRF-TOKEN: $token"} \
  -F "file=@/etc/hosts;filename=e2e-hosts.txt;type=text/plain" \
  ${ORG_ID:+ -F "organization_id=$ORG_ID"})
if [[ "$code" == "200" || "$code" == "201" ]]; then
  record PASS Files Upload "HTTP $code"
  FILE_ID=$(json_field data.id)
else
  record WARN Files Upload "HTTP $code $(head -c 140 /tmp/acb_e2e_body.json)"
  http_code_only GET /files >/dev/null
  FILE_ID=$(first_id)
fi
[[ -n "$FILE_ID" ]] && check_get Files "/files/$FILE_ID" Detail
if [[ -n "$FILE_ID" ]]; then
  dcode=$(curl -sS -m 30 -c "$JAR" -b "$JAR" -o /dev/null -w "%{http_code}" \
    -H "Origin: $ORIGIN" -H "Accept: application/json" \
    ${token:+ -H "X-XSRF-TOKEN: $token"} \
    "$API/files/$FILE_ID/download")
  [[ "$dcode" == "200" || "$dcode" == "302" ]] && record PASS Files Download "HTTP $dcode" || record FAIL Files Download "HTTP $dcode"
fi

for path_label in \
  "/reports/overview|Overview" \
  "/reports/projects-by-status|Projects tab" \
  "/reports/tasks-by-status|Tasks tab" \
  "/reports/team-performance|Team Performance" \
  "/reports/task-completion-trend|Completion trend" \
  "/time-entries/reports/summary|Time Tracking tab API"; do
  path="${path_label%%|*}"
  label="${path_label##*|}"
  check_get Reports "$path" "$label"
done

code=$(http_code_only GET /audit-logs)
if [[ "$code" == "200" ]]; then
  record PASS "Audit Logs" List "HTTP 200"
  python3 <<'PY' | while read -r line; do record $line; done
import json
data=json.load(open("/tmp/acb_e2e_body.json"))
d=data.get("data")
items=d if isinstance(d,list) else (d.get("data") if isinstance(d,dict) else [])
print(("PASS" if items else "WARN"), "Audit Logs", "Entries present after actions", f"count={len(items) if items else 0}")
if items:
    first=items[0]
    has=bool(first.get("link") or first.get("entity_id") or first.get("entityId") or first.get("entity_type") or first.get("entityType"))
    print(("PASS" if has else "WARN"), "Cross-links", "Audit log entity metadata present", "checked first row")
PY
elif [[ "$code" == "403" ]]; then
  record WARN "Audit Logs" List "HTTP 403 (role-scoped — expected for Employee)"
else
  record FAIL "Audit Logs" List "HTTP $code"
fi

[[ -n "$ME_ID" ]] && check_get Profile "/users/$ME_ID" "Current user detail"
[[ -n "$ME_ID" ]] && check_get Profile "/users/$ME_ID/tasks" "Aggregated tasks"
[[ -n "$ME_ID" ]] && check_get Profile "/users/$ME_ID/projects" "Aggregated projects"
[[ -n "$ORG_ID" ]] && check_get Settings "/organizations/$ORG_ID" "Organization section data"
[[ -n "$ME_ID" && -n "$ME_NAME" ]] && check_mutate Settings "Account update" PATCH "/users/$ME_ID" "{\"name\":\"$ME_NAME\"}"

c1=$(http_code_only GET /organizations)
c2=$(http_code_only GET /users)
[[ "$c1" == "200" && "$c2" == "200" ]] && record PASS "Dashboard Home" "Supporting list APIs" || record FAIL "Dashboard Home" "Supporting list APIs" "$c1/$c2"

code=$(http_code_only GET /brain/health)
[[ "$code" == "200" ]] && record PASS "Knowledge" "Brain health proxy" || record WARN "Knowledge" "Brain health proxy" "HTTP $code"

echo
echo "=== SUMMARY ==="
echo "PASS=$PASS WARN=$WARN FAIL=$FAIL"
echo "Full log: $REPORT"
