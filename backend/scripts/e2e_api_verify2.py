#!/usr/bin/env python3
"""E2E API verification via curl (cookie-jar compatible with Laravel Domain=localhost)."""
from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import unquote

BASE = "http://localhost:8000"
API = f"{BASE}/api/v1"
ORIGIN = "http://localhost:5173"
JAR = Path("/tmp/acb_e2e2_cookies.txt")
BODY = Path("/tmp/acb_e2e2_body.json")
JAR.write_text("")
RESULTS = []


def record(area, check, status, detail=""):
    RESULTS.append((area, check, status, detail))
    print(f"[{status}] {area} :: {check}" + (f" — {detail}" if detail else ""))


def xsrf() -> str:
    if not JAR.exists():
        return ""
    for line in JAR.read_text().splitlines():
        if line.startswith("#") or not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) >= 7 and parts[5] == "XSRF-TOKEN":
            return unquote(parts[6])
    return ""


def curl(method: str, url: str, data=None, form=None, raw_file=False) -> tuple[int, object]:
    token = xsrf()
    cmd = [
        "curl", "-sS", "-m", "60",
        "-c", str(JAR), "-b", str(JAR),
        "-o", str(BODY), "-w", "%{http_code}",
        "-X", method, url,
        "-H", f"Origin: {ORIGIN}",
        "-H", f"Referer: {ORIGIN}/",
        "-H", "Accept: application/json",
        "-H", "X-Requested-With: XMLHttpRequest",
    ]
    if token:
        cmd += ["-H", f"X-XSRF-TOKEN: {token}"]
    if form:
        for item in form:
            cmd += ["-F", item]
    elif data is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(data)]
    out = subprocess.check_output(cmd, text=True).strip()
    code = int(out or "0")
    try:
        payload = json.loads(BODY.read_text() or "null")
    except Exception:
        payload = BODY.read_text() if BODY.exists() else None
    return code, payload


def csrf():
    code, _ = curl("GET", f"{BASE}/sanctum/csrf-cookie")
    return bool(xsrf()), code


def first_id(payload) -> str | None:
    if not isinstance(payload, dict):
        return None
    d = payload.get("data")
    if isinstance(d, list) and d:
        return str(d[0].get("id")) if d[0].get("id") is not None else None
    if isinstance(d, dict):
        if isinstance(d.get("data"), list) and d["data"]:
            return str(d["data"][0].get("id"))
        if d.get("id") is not None:
            return str(d.get("id"))
    return None


def data_obj(payload):
    if isinstance(payload, dict):
        d = payload.get("data")
        return d if isinstance(d, dict) else {}
    return {}


def expect(area, check, code, ok_codes=(200,), warn_codes=(403, 422), detail=""):
    if code in ok_codes:
        record(area, check, "PASS", detail or f"HTTP {code}")
        return True
    if code in warn_codes:
        record(area, check, "WARN", detail or f"HTTP {code}")
        return False
    record(area, check, "FAIL", detail or f"HTTP {code}")
    return False


def main():
    # Servers
    code, _ = curl("GET", f"{BASE}/up")
    expect("Servers", "Laravel /up", code)
    code = int(subprocess.check_output(
        ["curl", "-sS", "-m", "5", "-o", "/dev/null", "-w", "%{http_code}", "http://localhost:5173/"],
        text=True,
    ).strip() or "0")
    expect("Servers", "Vite :5173", code)

    ok, ccode = csrf()
    expect("Auth", "CSRF cookie", 200 if ok else 0, detail=f"HTTP {ccode}")

    # Auth with Super Admin for full module access
    csrf()
    code, body = curl("POST", f"{API}/auth/login", {"email": "wrong@example.com", "password": "nope"})
    expect("Auth", "Wrong password returns 401", code, ok_codes=(401,))
    csrf()
    code, body = curl("POST", f"{API}/auth/login", {"email": "ahsan@example.com", "password": "password"})
    expect("Auth", "Login Super Admin", code, detail=f"HTTP {code}")
    code, me = curl("GET", f"{API}/auth/me")
    me_id = str(data_obj(me).get("id") or "")
    expect("Auth", "Session /auth/me", code, detail=f"id={me_id} role={data_obj(me).get('role')}")

    # Register flow separately (then restore admin session)
    csrf()
    code, _ = curl("POST", f"{API}/auth/logout", {})
    expect("Auth", "Logout", code)
    csrf()
    email = f"e2e.reg.{Path(tempfile.mktemp()).name[-6:]}@example.com"
    code, _ = curl("POST", f"{API}/auth/register", {
        "name": "E2E Reg", "email": email, "password": "password123", "password_confirmation": "password123",
    })
    expect("Auth", "Register new user", code, ok_codes=(200, 201), detail=f"HTTP {code}")
    code, _ = curl("POST", f"{API}/auth/logout", {})
    csrf()
    code, _ = curl("POST", f"{API}/auth/login", {"email": "ahsan@example.com", "password": "password"})
    expect("Auth", "Re-login Super Admin for modules", code)

    code = int(subprocess.check_output(
        ["curl", "-sS", "-m", "10", "-o", "/dev/null", "-w", "%{http_code}",
         "-H", "Accept: application/json", f"{API}/auth/me"],
        text=True,
    ).strip() or "0")
    expect("Auth", "Unauthenticated /auth/me blocked", code, ok_codes=(401, 419))

    # --- Modules ---
    code, orgs = curl("GET", f"{API}/organizations")
    org_id = first_id(orgs)
    expect("Organizations", "List", code, detail=f"id={org_id}")
    if org_id:
        code, show = curl("GET", f"{API}/organizations/{org_id}")
        expect("Organizations", "Detail", code)
        name = data_obj(show).get("name") or "Org"
        code, _ = curl("PATCH", f"{API}/organizations/{org_id}", {"name": name})
        expect("Organizations", "Update", code)
    code, created = curl("POST", f"{API}/organizations", {"name": f"E2E Org {Path(tempfile.mktemp()).name[-4:]}"})
    expect("Organizations", "Create", code, ok_codes=(200, 201))

    code, users = curl("GET", f"{API}/users")
    user_id = first_id(users) or me_id
    expect("Users", "List", code, detail=f"id={user_id}")
    if user_id:
        code, _ = curl("GET", f"{API}/users/{user_id}")
        expect("Users", "Detail", code)
        code, _ = curl("GET", f"{API}/users/{user_id}/tasks")
        expect("Users", "User tasks", code)
        code, _ = curl("GET", f"{API}/users/{user_id}/projects")
        expect("Users", "User projects", code)
        code, show = curl("GET", f"{API}/users/{user_id}")
        uname = data_obj(show).get("name") or "User"
        code, _ = curl("PATCH", f"{API}/users/{user_id}", {"name": uname})
        expect("Users", "Update", code)
    code, _ = curl("POST", f"{API}/users", {
        "name": "E2E Invite",
        "email": f"e2e.inv.{Path(tempfile.mktemp()).name[-6:]}@example.com",
        "password": "password123",
        "password_confirmation": "password123",
        "role": "Employee",
        "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
    })
    expect("Users", "Create/Invite", code, ok_codes=(200, 201))

    code, deps = curl("GET", f"{API}/departments")
    dep_id = first_id(deps)
    expect("Departments", "List", code, detail=f"id={dep_id}")
    team_from_dep = None
    if dep_id:
        code, _ = curl("GET", f"{API}/departments/{dep_id}")
        expect("Departments", "Detail", code)
        code, teams_payload = curl("GET", f"{API}/departments/{dep_id}/teams")
        expect("Departments", "Teams section", code)
        team_from_dep = first_id(teams_payload)
        code, show = curl("GET", f"{API}/departments/{dep_id}")
        code, _ = curl("PATCH", f"{API}/departments/{dep_id}", {"name": data_obj(show).get("name") or "Dept"})
        expect("Departments", "Update", code)
    code, _ = curl("POST", f"{API}/departments", {
        "name": f"E2E Dept {Path(tempfile.mktemp()).name[-4:]}",
        "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
    })
    expect("Departments", "Create", code, ok_codes=(200, 201))

    code, teams = curl("GET", f"{API}/teams")
    team_id = first_id(teams) or team_from_dep
    expect("Teams", "List", code, detail=f"id={team_id}")
    if team_id:
        code, _ = curl("GET", f"{API}/teams/{team_id}")
        expect("Teams", "Detail", code)
        code, show = curl("GET", f"{API}/teams/{team_id}")
        code, _ = curl("PATCH", f"{API}/teams/{team_id}", {"name": data_obj(show).get("name") or "Team"})
        expect("Teams", "Update", code)
    code, _ = curl("POST", f"{API}/teams", {
        "name": f"E2E Team {Path(tempfile.mktemp()).name[-4:]}",
        "department_id": int(dep_id) if dep_id and dep_id.isdigit() else None,
        "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
    })
    expect("Teams", "Create", code, ok_codes=(200, 201))
    if dep_id and team_from_dep:
        c1, _ = curl("GET", f"{API}/teams/{team_from_dep}")
        c2, _ = curl("GET", f"{API}/departments/{dep_id}/teams")
        expect("Cross-links", "Department → Teams → Team Detail", 200 if c1 == 200 and c2 == 200 else 0)

    code, projects = curl("GET", f"{API}/projects")
    project_id = first_id(projects)
    expect("Projects", "List", code, detail=f"id={project_id}")
    project_task_id = None
    if project_id:
        code, _ = curl("GET", f"{API}/projects/{project_id}")
        expect("Projects", "Detail", code)
        code, pt = curl("GET", f"{API}/projects/{project_id}/tasks")
        expect("Projects", "Tasks tab", code)
        project_task_id = first_id(pt)
        code, show = curl("GET", f"{API}/projects/{project_id}")
        code, _ = curl("PATCH", f"{API}/projects/{project_id}", {"name": data_obj(show).get("name") or "Project"})
        expect("Projects", "Update", code)
    code, _ = curl("POST", f"{API}/projects", {
        "name": f"E2E Project {Path(tempfile.mktemp()).name[-4:]}",
        "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
        "status": "planning",
    })
    expect("Projects", "Create", code, ok_codes=(200, 201))

    code, tasks = curl("GET", f"{API}/tasks")
    task_id = first_id(tasks) or project_task_id
    expect("Tasks", "List", code, detail=f"id={task_id}")
    created_task = None
    if task_id:
        code, _ = curl("GET", f"{API}/tasks/{task_id}")
        expect("Tasks", "Detail", code)
    if project_id:
        code, created = curl("POST", f"{API}/tasks", {
            "title": f"E2E Task {Path(tempfile.mktemp()).name[-4:]}",
            "project_id": int(project_id),
            "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
            "status": "todo",
            "priority": "medium",
        })
        expect("Tasks", "Create", code, ok_codes=(200, 201))
        created_task = first_id(created) or str(data_obj(created).get("id") or "") or None
    target = created_task or task_id
    if target:
        code, _ = curl("PATCH", f"{API}/tasks/{target}/status", {"status": "in_progress"})
        expect("Tasks", "Update status", code)
        code, _ = curl("POST", f"{API}/tasks/{target}/subtasks", {"title": "E2E subtask"})
        expect("Tasks", "Create subtask", code, ok_codes=(200, 201))
        code, _ = curl("GET", f"{API}/tasks/{target}/subtasks")
        expect("Tasks", "List subtasks", code)
        code, _ = curl("POST", f"{API}/tasks/{target}/comments", {"body": "E2E comment"})
        if code not in (200, 201):
            code, _ = curl("POST", f"{API}/tasks/{target}/comments", {"content": "E2E comment"})
        expect("Tasks", "Create comment", code, ok_codes=(200, 201))
    if project_task_id:
        code, _ = curl("GET", f"{API}/tasks/{project_task_id}")
        expect("Cross-links", "Project Tasks → Task detail", code)

    code, meetings = curl("GET", f"{API}/meetings")
    meeting_id = first_id(meetings)
    expect("Meetings", "List", code, detail=f"id={meeting_id}")
    if meeting_id:
        code, _ = curl("GET", f"{API}/meetings/{meeting_id}")
        expect("Meetings", "Detail", code)
        code, _ = curl("POST", f"{API}/meetings/{meeting_id}/agenda-items", {"title": "E2E agenda"})
        expect("Meetings", "Agenda create", code, ok_codes=(200, 201))
        if me_id:
            code, _ = curl("PATCH", f"{API}/meetings/{meeting_id}/attendees/{me_id}/rsvp", {"rsvp_status": "accepted"})
            expect("Meetings", "RSVP update", code, warn_codes=(403, 404, 422))
        code, show = curl("GET", f"{API}/meetings/{meeting_id}")
        code, _ = curl("PATCH", f"{API}/meetings/{meeting_id}", {"title": data_obj(show).get("title") or "Meeting"})
        expect("Meetings", "Update", code)
    code, _ = curl("POST", f"{API}/meetings", {
        "title": f"E2E Meeting {Path(tempfile.mktemp()).name[-4:]}",
        "date": "2026-08-01",
        "start_time": "10:00",
        "duration_minutes": 60,
        "project_id": int(project_id) if project_id and project_id.isdigit() else None,
    })
    expect("Meetings", "Create", code, ok_codes=(200, 201))

    code, entries = curl("GET", f"{API}/time-entries")
    expect("Time Tracking", "List", code)
    for path, label in [
        ("/time-entries/reports/summary", "Reports summary"),
        ("/time-entries/reports/by-project", "Reports by project"),
        ("/time-entries/reports/by-user", "Reports by user"),
    ]:
        code, _ = curl("GET", f"{API}{path}")
        expect("Time Tracking", label, code)
    code, created_entry = curl("POST", f"{API}/time-entries", {
        "task_id": int(target) if target and str(target).isdigit() else None,
        "project_id": int(project_id) if project_id and project_id.isdigit() else None,
        "date": "2026-07-30",
        "duration_minutes": 90,
        "note": "E2E entry",
    })
    expect("Time Tracking", "Manual entry create", code, ok_codes=(200, 201))
    entry_id = first_id(created_entry) or first_id(entries) or str(data_obj(created_entry).get("id") or "")
    if entry_id:
        code, _ = curl("PATCH", f"{API}/time-entries/{entry_id}", {"note": "E2E updated"})
        expect("Time Tracking", "Update entry", code)

    code, folders = curl("GET", f"{API}/folders")
    folder_id = first_id(folders)
    expect("Files", "Folders list", code, detail=f"id={folder_id}")
    if folder_id:
        code, _ = curl("GET", f"{API}/folders/{folder_id}/contents")
        expect("Files", "Folder contents", code)
    code, _ = curl("POST", f"{API}/folders", {
        "name": f"E2E Folder {Path(tempfile.mktemp()).name[-4:]}",
        "organization_id": int(org_id) if org_id and org_id.isdigit() else None,
    })
    expect("Files", "Create folder", code, ok_codes=(200, 201))
    hosts = Path("/etc/hosts")
    form = [f"file=@{hosts};filename=e2e.txt;type=text/plain"]
    if org_id:
        form.append(f"organization_id={org_id}")
    code, uploaded = curl("POST", f"{API}/files", form=form)
    expect("Files", "Upload", code, ok_codes=(200, 201))
    file_id = first_id(uploaded) or str(data_obj(uploaded).get("id") or "")
    if not file_id:
        code, files = curl("GET", f"{API}/files")
        file_id = first_id(files)
    if file_id:
        code, _ = curl("GET", f"{API}/files/{file_id}")
        expect("Files", "Detail", code)
        # download may be binary
        token = xsrf()
        cmd = [
            "curl", "-sS", "-m", "30", "-c", str(JAR), "-b", str(JAR),
            "-o", "/dev/null", "-w", "%{http_code}",
            "-H", f"Origin: {ORIGIN}", "-H", "Accept: application/json",
            f"{API}/files/{file_id}/download",
        ]
        if token:
            cmd += ["-H", f"X-XSRF-TOKEN: {token}"]
        dcode = int(subprocess.check_output(cmd, text=True).strip() or "0")
        expect("Files", "Download", dcode, ok_codes=(200, 302))

    for path, label in [
        ("/reports/overview", "Overview"),
        ("/reports/projects-by-status", "Projects tab"),
        ("/reports/tasks-by-status", "Tasks tab"),
        ("/reports/team-performance", "Team Performance"),
        ("/reports/task-completion-trend", "Completion trend"),
        ("/time-entries/reports/summary", "Time Tracking tab"),
    ]:
        code, _ = curl("GET", f"{API}{path}")
        expect("Reports", label, code)

    code, logs = curl("GET", f"{API}/audit-logs")
    expect("Audit Logs", "List", code)
    items = []
    if isinstance(logs, dict):
        d = logs.get("data")
        items = d if isinstance(d, list) else (d.get("data") if isinstance(d, dict) else [])
    expect("Audit Logs", "Entries present", 200 if items else 0, detail=f"count={len(items)}")
    if items:
        first = items[0]
        has = any(first.get(k) for k in ("link", "entity_id", "entityId", "entity_type", "entityType"))
        expect("Cross-links", "Audit entity metadata", 200 if has else 0)

    if me_id:
        code, _ = curl("GET", f"{API}/users/{me_id}")
        expect("Profile", "Current user detail", code)
        code, _ = curl("GET", f"{API}/users/{me_id}/tasks")
        expect("Profile", "Aggregated tasks", code)
        code, _ = curl("GET", f"{API}/users/{me_id}/projects")
        expect("Profile", "Aggregated projects", code)
        code, show = curl("GET", f"{API}/users/{me_id}")
        code, _ = curl("PATCH", f"{API}/users/{me_id}", {"name": data_obj(show).get("name") or "Admin"})
        expect("Settings", "Account update", code)
    if org_id:
        code, _ = curl("GET", f"{API}/organizations/{org_id}")
        expect("Settings", "Organization section data", code)

    c1, _ = curl("GET", f"{API}/organizations")
    c2, _ = curl("GET", f"{API}/users")
    expect("Dashboard Home", "Supporting list APIs", 200 if c1 == 200 and c2 == 200 else 0)

    code, _ = curl("GET", f"{API}/brain/health")
    expect("Knowledge", "Brain health proxy", code, warn_codes=(500, 503))

    # Frontend static/known limitations (code review, not API)
    record("Command Palette", "Search index wiring", "WARN", "Static Fuse index in searchData.js — not live API entities")
    record("Dashboard Home", "Projects/Tasks/Meetings stat cards", "WARN", "Hardcoded dummy values in Dashboard.jsx; Users/Orgs from API")
    record("Settings", "Security password change", "WARN", "UI-only note in SecuritySettings.jsx")
    record("Settings", "Notification preferences", "WARN", "UI-only local state in NotificationSettings.jsx")
    record("Settings", "Billing", "WARN", "Static/dummy section (by design)")

    print("\n=== MODULE ROLLUP ===")
    areas = {}
    for area, check, status, detail in RESULTS:
        areas.setdefault(area, []).append(status)
    for area, statuses in areas.items():
        if "FAIL" in statuses:
            overall = "FAIL"
        elif "WARN" in statuses:
            overall = "WARN"
        else:
            overall = "PASS"
        print(f"{overall:4} | {area}")

    fails = [r for r in RESULTS if r[2] == "FAIL"]
    if fails:
        print("\n=== FAILURES ===")
        for area, check, status, detail in fails:
            print(f"- {area} / {check}: {detail[:200]}")


if __name__ == "__main__":
    main()
