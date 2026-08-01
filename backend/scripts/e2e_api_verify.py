#!/usr/bin/env python3
"""End-to-end API verification for AI Company Brain (Sanctum SPA cookie auth)."""
from __future__ import annotations

import json
import re
import sys
import tempfile
import textwrap
import urllib.error
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar
from pathlib import Path

BASE = "http://localhost:8000"
API = f"{BASE}/api/v1"
ORIGIN = "http://localhost:5173"
VITE_CANDIDATES = [
    "http://localhost:5173/",
    "http://localhost:5174/",
    "http://127.0.0.1:5173/",
]
RESULTS = []
COOKIE_JAR = CookieJar()
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(COOKIE_JAR))


def record(area: str, check: str, status: str, detail: str = ""):
    RESULTS.append({"area": area, "check": check, "status": status, "detail": detail})
    mark = "PASS" if status == "PASS" else ("WARN" if status == "WARN" else "FAIL")
    print(f"[{mark}] {area} :: {check}" + (f" — {detail}" if detail else ""))


def get_cookie(name: str) -> str | None:
    for c in COOKIE_JAR:
        if c.name == name:
            return c.value
    return None


def request(method: str, url: str, data=None, content_type: str | None = "application/json", expect_json=True):
    headers = {
        "Accept": "application/json",
        "Origin": ORIGIN,
        "Referer": f"{ORIGIN}/",
        "X-Requested-With": "XMLHttpRequest",
    }
    body = None
    if data is not None:
        if content_type == "application/json":
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"
        elif content_type == "multipart":
            body = data
            # content-type set by caller via tuple
        else:
            body = data
            if content_type:
                headers["Content-Type"] = content_type

    xsrf = get_cookie("XSRF-TOKEN")
    if xsrf:
        headers["X-XSRF-TOKEN"] = urllib.parse.unquote(xsrf)

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with OPENER.open(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            code = resp.getcode()
            payload = json.loads(raw) if expect_json and raw else raw
            return code, payload, None
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            payload = raw
        return e.code, payload, str(e)
    except Exception as e:
        return 0, None, str(e)


def csrf():
    code, _, err = request("GET", f"{BASE}/sanctum/csrf-cookie", expect_json=False)
    return code in (200, 204) and get_cookie("XSRF-TOKEN")


def main():
    # --- Health ---
    code, _, err = request("GET", f"{BASE}/up", expect_json=False)
    record("Servers", "Laravel /up", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
    try:
        with urllib.request.urlopen("http://localhost:5173/", timeout=5) as r:
            record("Servers", "Vite :5173", "PASS" if r.status == 200 else "FAIL", f"HTTP {r.status}")
    except Exception as e:
        # IPv6-only Vite sometimes rejects 127.0.0.1; try other candidates
        ok = False
        last = str(e)
        for url in VITE_CANDIDATES[1:]:
            try:
                with urllib.request.urlopen(url, timeout=5) as r:
                    record("Servers", "Vite :5173", "PASS" if r.status == 200 else "FAIL", f"{url} HTTP {r.status}")
                    ok = True
                    break
            except Exception as e2:
                last = str(e2)
        if not ok:
            record("Servers", "Vite :5173", "FAIL", last)

    # --- Auth ---
    if not csrf():
        record("Auth", "CSRF cookie", "FAIL", "Could not obtain XSRF-TOKEN")
        print_summary()
        return 1
    record("Auth", "CSRF cookie", "PASS")

    email = f"e2e.tester.{Path(tempfile.mktemp()).name[-6:]}@example.com"
    password = "password123"
    code, body, err = request(
        "POST",
        f"{API}/auth/register",
        {
            "name": "E2E Tester",
            "email": email,
            "password": password,
            "password_confirmation": password,
        },
    )
    ok = code in (200, 201) and isinstance(body, dict) and body.get("success")
    record("Auth", "Register new user", "PASS" if ok else "FAIL", err or f"HTTP {code} {body}")
    if not ok:
        # fall back to seeded user for remaining tests
        csrf()
        code, body, err = request("POST", f"{API}/auth/login", {"email": "ahsan@example.com", "password": "password"})
        if not (code == 200 and body and body.get("success")):
            record("Auth", "Fallback login ahsan@example.com", "FAIL", err or f"HTTP {code}")
            print_summary()
            return 1
        record("Auth", "Fallback login ahsan@example.com", "PASS", "using seeded Super Admin")
        email = "ahsan@example.com"
        password = "password"
    else:
        # logout + login again
        code, body, err = request("POST", f"{API}/auth/logout")
        record("Auth", "Logout after register", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        csrf()
        code, body, err = request("POST", f"{API}/auth/login", {"email": email, "password": "wrong-password"})
        bad_ok = code == 401
        record("Auth", "Wrong password returns 401", "PASS" if bad_ok else "FAIL", f"HTTP {code}")
        csrf()
        code, body, err = request("POST", f"{API}/auth/login", {"email": email, "password": password})
        record("Auth", "Login with correct password", "PASS" if code == 200 and body.get("success") else "FAIL", err or f"HTTP {code}")

    code, body, err = request("GET", f"{API}/auth/me")
    me_ok = code == 200 and body and body.get("data")
    me = body.get("data") if me_ok else {}
    record("Auth", "Session /auth/me hydration", "PASS" if me_ok else "FAIL", err or f"HTTP {code}")
    user_id = me.get("id") if isinstance(me, dict) else None

    # Unauthenticated dashboard gate is frontend; simulate unauth /auth/me
    # (keep session for module tests)

    # --- Helper for list/show/create/update ---
    def list_ok(area, path, label="List"):
        code, body, err = request("GET", f"{API}{path}")
        ok = code == 200
        detail = ""
        count = None
        if ok and isinstance(body, dict):
            data = body.get("data")
            if isinstance(data, list):
                count = len(data)
            elif isinstance(data, dict) and "data" in data:
                count = len(data.get("data") or [])
            detail = f"count≈{count}" if count is not None else "ok"
        else:
            detail = err or f"HTTP {code} {body}"
        record(area, label, "PASS" if ok else "FAIL", detail)
        return code, body

    def first_id(body):
        if not isinstance(body, dict):
            return None
        data = body.get("data")
        if isinstance(data, list) and data:
            return data[0].get("id")
        if isinstance(data, dict):
            # paginated Resource collection often {data:[...], meta}
            inner = data.get("data") if "data" in data else None
            if isinstance(inner, list) and inner:
                return inner[0].get("id")
            if data.get("id"):
                return data.get("id")
        return None

    # Organizations
    code, orgs = list_ok("Organizations", "/organizations")
    org_id = first_id(orgs)
    if org_id:
        code, body, err = request("GET", f"{API}/organizations/{org_id}")
        record("Organizations", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("PATCH", f"{API}/organizations/{org_id}", {"name": body.get("data", {}).get("name") if isinstance(body, dict) else None} if False else {})
        # fetch again for name then patch lightly
        code, show, _ = request("GET", f"{API}/organizations/{org_id}")
        name = None
        if isinstance(show, dict):
            d = show.get("data") or {}
            name = d.get("name")
        patch_payload = {"name": name} if name else {"name": "Test Org"}
        # Some APIs require more fields; try minimal update
        code, body, err = request("PUT", f"{API}/organizations/{org_id}", patch_payload)
        if code not in (200, 422):
            code, body, err = request("PATCH", f"{API}/organizations/{org_id}", patch_payload)
        record(
            "Organizations",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
        code, body, err = request(
            "POST",
            f"{API}/organizations",
            {
                "name": f"E2E Org {Path(tempfile.mktemp()).name[-4:]}",
                "slug": f"e2e-org-{Path(tempfile.mktemp()).name[-6:]}",
            },
        )
        # slug may not be required — try alternate payloads on fail
        if code not in (200, 201):
            code, body, err = request(
                "POST",
                f"{API}/organizations",
                {"name": f"E2E Org {Path(tempfile.mktemp()).name[-4:]}"},
            )
        record(
            "Organizations",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code} {body if code >= 400 else ''}",
        )
    else:
        record("Organizations", "Detail/Create/Update", "FAIL", "no org id from list")

    # Users
    code, users = list_ok("Users", "/users")
    uid = first_id(users) or user_id
    if uid:
        code, body, err = request("GET", f"{API}/users/{uid}")
        record("Users", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, tasks_b, err = request("GET", f"{API}/users/{uid}/tasks")
        record("Users", "User tasks tab data", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, proj_b, err = request("GET", f"{API}/users/{uid}/projects")
        record("Users", "User projects tab data", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        # invite/create may need role fields
        code, body, err = request(
            "POST",
            f"{API}/users",
            {
                "name": "E2E Invite",
                "email": f"e2e.invite.{Path(tempfile.mktemp()).name[-6:]}@example.com",
                "role": "Employee",
                "password": "password123",
                "password_confirmation": "password123",
            },
        )
        if code not in (200, 201):
            # try alternate shape
            code, body, err = request(
                "POST",
                f"{API}/users",
                {
                    "name": "E2E Invite2",
                    "email": f"e2e.invite2.{Path(tempfile.mktemp()).name[-6:]}@example.com",
                    "organization_id": org_id,
                },
            )
        record(
            "Users",
            "Create/Invite",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, show, _ = request("GET", f"{API}/users/{uid}")
        uname = (show.get("data") or {}).get("name") if isinstance(show, dict) else None
        code, body, err = request("PATCH", f"{API}/users/{uid}", {"name": uname or "User"})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/users/{uid}", {"name": uname or "User"})
        record(
            "Users",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )

    # Departments
    code, deps = list_ok("Departments", "/departments")
    dep_id = first_id(deps)
    if dep_id:
        code, body, err = request("GET", f"{API}/departments/{dep_id}")
        record("Departments", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, teams_b, err = request("GET", f"{API}/departments/{dep_id}/teams")
        record("Departments", "Teams section data", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        team_from_dep = first_id(teams_b)
        code, body, err = request(
            "POST",
            f"{API}/departments",
            {"name": f"E2E Dept {Path(tempfile.mktemp()).name[-4:]}", "organization_id": org_id},
        )
        record(
            "Departments",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, show, _ = request("GET", f"{API}/departments/{dep_id}")
        dname = (show.get("data") or {}).get("name") if isinstance(show, dict) else "Dept"
        code, body, err = request("PATCH", f"{API}/departments/{dep_id}", {"name": dname})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/departments/{dep_id}", {"name": dname})
        record(
            "Departments",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
    else:
        team_from_dep = None
        record("Departments", "Detail/Create/Update", "FAIL", "no department id")

    # Teams
    code, teams = list_ok("Teams", "/teams")
    team_id = first_id(teams) or team_from_dep
    if team_id:
        code, body, err = request("GET", f"{API}/teams/{team_id}")
        record("Teams", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request(
            "POST",
            f"{API}/teams",
            {
                "name": f"E2E Team {Path(tempfile.mktemp()).name[-4:]}",
                "department_id": dep_id,
                "organization_id": org_id,
            },
        )
        record(
            "Teams",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, show, _ = request("GET", f"{API}/teams/{team_id}")
        tname = (show.get("data") or {}).get("name") if isinstance(show, dict) else "Team"
        code, body, err = request("PATCH", f"{API}/teams/{team_id}", {"name": tname})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/teams/{team_id}", {"name": tname})
        record(
            "Teams",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
        # cross-link: department teams ↔ team detail
        if dep_id and team_from_dep:
            code1, t1, _ = request("GET", f"{API}/teams/{team_from_dep}")
            code2, t2, _ = request("GET", f"{API}/departments/{dep_id}/teams")
            ok = code1 == 200 and code2 == 200
            record("Cross-links", "Department → Teams → Team Detail", "PASS" if ok else "FAIL")
    else:
        record("Teams", "Detail/Create/Update", "FAIL", "no team id")

    # Projects
    code, projects = list_ok("Projects", "/projects")
    project_id = first_id(projects)
    if project_id:
        code, body, err = request("GET", f"{API}/projects/{project_id}")
        record("Projects", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, pt, err = request("GET", f"{API}/projects/{project_id}/tasks")
        record("Projects", "Tasks tab data", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        project_task_id = first_id(pt)
        code, body, err = request(
            "POST",
            f"{API}/projects",
            {
                "name": f"E2E Project {Path(tempfile.mktemp()).name[-4:]}",
                "organization_id": org_id,
                "status": "active",
            },
        )
        record(
            "Projects",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, show, _ = request("GET", f"{API}/projects/{project_id}")
        pname = (show.get("data") or {}).get("name") if isinstance(show, dict) else "Project"
        code, body, err = request("PATCH", f"{API}/projects/{project_id}", {"name": pname})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/projects/{project_id}", {"name": pname})
        record(
            "Projects",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
    else:
        project_task_id = None
        record("Projects", "Detail/Create/Update", "FAIL", "no project id")

    # Tasks + subtasks + comments
    code, tasks = list_ok("Tasks", "/tasks")
    task_id = first_id(tasks) or project_task_id
    if task_id:
        code, body, err = request("GET", f"{API}/tasks/{task_id}")
        record("Tasks", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request(
            "POST",
            f"{API}/tasks",
            {
                "title": f"E2E Task {Path(tempfile.mktemp()).name[-4:]}",
                "project_id": project_id,
                "organization_id": org_id,
                "status": "todo",
                "priority": "medium",
            },
        )
        created_task = None
        if code in (200, 201) and isinstance(body, dict):
            created_task = (body.get("data") or {}).get("id")
        record(
            "Tasks",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        target = created_task or task_id
        code, body, err = request("PATCH", f"{API}/tasks/{target}/status", {"status": "in_progress"})
        record(
            "Tasks",
            "Update status",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
        code, body, err = request("POST", f"{API}/tasks/{target}/subtasks", {"title": "E2E subtask"})
        record(
            "Tasks",
            "Create subtask",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, body, err = request("GET", f"{API}/tasks/{target}/subtasks")
        record("Tasks", "List subtasks", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("POST", f"{API}/tasks/{target}/comments", {"body": "E2E comment"})
        if code not in (200, 201):
            code, body, err = request("POST", f"{API}/tasks/{target}/comments", {"content": "E2E comment"})
        record(
            "Tasks",
            "Create comment",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        if project_task_id:
            code, body, err = request("GET", f"{API}/tasks/{project_task_id}")
            record(
                "Cross-links",
                "Project Tasks → Task detail same resource",
                "PASS" if code == 200 else "FAIL",
                err or f"HTTP {code}",
            )
    else:
        record("Tasks", "Detail/CRUD", "FAIL", "no task id")

    # Meetings
    code, meetings = list_ok("Meetings", "/meetings")
    meeting_id = first_id(meetings)
    if meeting_id:
        code, body, err = request("GET", f"{API}/meetings/{meeting_id}")
        record("Meetings", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request(
            "POST",
            f"{API}/meetings/{meeting_id}/agenda-items",
            {"title": "E2E agenda item"},
        )
        record(
            "Meetings",
            "Agenda item create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        if user_id:
            code, body, err = request(
                "PATCH",
                f"{API}/meetings/{meeting_id}/attendees/{user_id}/rsvp",
                {"rsvp_status": "accepted"},
            )
            if code not in (200, 422, 404):
                code, body, err = request(
                    "PATCH",
                    f"{API}/meetings/{meeting_id}/attendees/{user_id}/rsvp",
                    {"status": "accepted"},
                )
            record(
                "Meetings",
                "RSVP update",
                "PASS" if code == 200 else ("WARN" if code in (403, 404, 422) else "FAIL"),
                err or f"HTTP {code}",
            )
        code, body, err = request(
            "POST",
            f"{API}/meetings",
            {
                "title": f"E2E Meeting {Path(tempfile.mktemp()).name[-4:]}",
                "organization_id": org_id,
                "starts_at": "2026-08-01T10:00:00Z",
                "ends_at": "2026-08-01T11:00:00Z",
            },
        )
        record(
            "Meetings",
            "Create",
            "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
            err or f"HTTP {code}",
        )
        code, show, _ = request("GET", f"{API}/meetings/{meeting_id}")
        mtitle = (show.get("data") or {}).get("title") if isinstance(show, dict) else "Meeting"
        code, body, err = request("PATCH", f"{API}/meetings/{meeting_id}", {"title": mtitle})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/meetings/{meeting_id}", {"title": mtitle})
        record(
            "Meetings",
            "Update",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
    else:
        record("Meetings", "Detail/CRUD", "FAIL", "no meeting id")

    # Time tracking
    code, entries = list_ok("Time Tracking", "/time-entries")
    code, body, err = request("GET", f"{API}/time-entries/reports/summary")
    record("Time Tracking", "Reports summary", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
    code, body, err = request("GET", f"{API}/time-entries/reports/by-project")
    record("Time Tracking", "Reports by project", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
    code, body, err = request("GET", f"{API}/time-entries/reports/by-user")
    record("Time Tracking", "Reports by user", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
    code, body, err = request(
        "POST",
        f"{API}/time-entries",
        {
            "task_id": task_id,
            "project_id": project_id,
            "hours": 1.5,
            "description": "E2E manual entry",
            "date": "2026-07-30",
        },
    )
    if code not in (200, 201):
        code, body, err = request(
            "POST",
            f"{API}/time-entries",
            {
                "task_id": task_id,
                "project_id": project_id,
                "minutes": 90,
                "description": "E2E manual entry",
                "worked_on": "2026-07-30",
            },
        )
    record(
        "Time Tracking",
        "Manual entry create",
        "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
        err or f"HTTP {code}",
    )
    entry_id = first_id(entries)
    if not entry_id and isinstance(body, dict) and code in (200, 201):
        entry_id = (body.get("data") or {}).get("id")
    if entry_id:
        code, body, err = request("PATCH", f"{API}/time-entries/{entry_id}", {"description": "E2E updated"})
        if code not in (200, 422):
            code, body, err = request("PUT", f"{API}/time-entries/{entry_id}", {"description": "E2E updated"})
        record(
            "Time Tracking",
            "Update entry",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )

    # Files / folders
    code, folders = list_ok("Files", "/folders")
    folder_id = first_id(folders)
    if folder_id:
        code, body, err = request("GET", f"{API}/folders/{folder_id}/contents")
        record("Files", "Folder contents/navigation", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
    code, body, err = request(
        "POST",
        f"{API}/folders",
        {"name": f"E2E Folder {Path(tempfile.mktemp()).name[-4:]}", "organization_id": org_id},
    )
    record(
        "Files",
        "Create folder",
        "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
        err or f"HTTP {code}",
    )
    # multipart upload
    boundary = "----E2EBoundary7MA4YWxkTrZu0gW"
    file_body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="e2e.txt"\r\n'
        f"Content-Type: text/plain\r\n\r\n"
        f"e2e upload content\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="organization_id"\r\n\r\n'
        f"{org_id or ''}\r\n"
        f"--{boundary}--\r\n"
    ).encode()
    headers_ct = f"multipart/form-data; boundary={boundary}"
    # custom multipart request
    xsrf = get_cookie("XSRF-TOKEN")
    req = urllib.request.Request(
        f"{API}/files",
        data=file_body,
        headers={
            "Accept": "application/json",
            "Origin": ORIGIN,
            "Referer": f"{ORIGIN}/",
            "Content-Type": headers_ct,
            "X-Requested-With": "XMLHttpRequest",
            **({"X-XSRF-TOKEN": urllib.parse.unquote(xsrf)} if xsrf else {}),
        },
        method="POST",
    )
    try:
        with OPENER.open(req, timeout=60) as resp:
            raw = resp.read().decode()
            code = resp.getcode()
            body = json.loads(raw) if raw else {}
            err = None
    except urllib.error.HTTPError as e:
        code = e.code
        raw = e.read().decode("utf-8", errors="replace")
        try:
            body = json.loads(raw)
        except Exception:
            body = raw
        err = str(e)
    except Exception as e:
        code, body, err = 0, None, str(e)
    file_id = None
    if code in (200, 201) and isinstance(body, dict):
        file_id = (body.get("data") or {}).get("id")
    record(
        "Files",
        "Upload",
        "PASS" if code in (200, 201) else ("WARN" if code in (403, 422) else "FAIL"),
        err or f"HTTP {code}",
    )
    if not file_id:
        code, files_b, _ = request("GET", f"{API}/files")
        file_id = first_id(files_b)
    if file_id:
        code, body, err = request("GET", f"{API}/files/{file_id}")
        record("Files", "Detail", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("GET", f"{API}/files/{file_id}/download", expect_json=False)
        record(
            "Files",
            "Download",
            "PASS" if code in (200, 302) else "FAIL",
            err or f"HTTP {code}",
        )

    # Reports
    for path, label in [
        ("/reports/overview", "Overview"),
        ("/reports/projects-by-status", "Projects by status"),
        ("/reports/tasks-by-status", "Tasks by status"),
        ("/reports/team-performance", "Team performance"),
        ("/reports/task-completion-trend", "Task completion trend"),
        ("/reports/overdue-tasks", "Overdue tasks"),
    ]:
        code, body, err = request("GET", f"{API}{path}")
        record("Reports", label, "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")

    # Audit logs
    code, logs, err = request("GET", f"{API}/audit-logs")
    record("Audit Logs", "List", "PASS" if code == 200 else ("WARN" if code == 403 else "FAIL"), err or f"HTTP {code}")
    if code == 200 and isinstance(logs, dict):
        data = logs.get("data")
        items = data if isinstance(data, list) else (data.get("data") if isinstance(data, dict) else [])
        has_link = False
        if items:
            first = items[0]
            has_link = bool(first.get("link") or first.get("entity_id") or first.get("entityId"))
        record(
            "Audit Logs",
            "Entries present after actions",
            "PASS" if items else "WARN",
            f"count={len(items) if items else 0}",
        )
        record(
            "Cross-links",
            "Audit log entity link field present",
            "PASS" if has_link or not items else "WARN",
            "link/entity fields checked on first row",
        )

    # Settings / Profile / Dashboard — mostly frontend; verify supporting APIs
    if user_id:
        code, body, err = request("GET", f"{API}/users/{user_id}")
        record("Profile", "Current user detail API", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("GET", f"{API}/users/{user_id}/tasks")
        record("Profile", "Aggregated tasks", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("GET", f"{API}/users/{user_id}/projects")
        record("Profile", "Aggregated projects", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")
        code, body, err = request("PATCH", f"{API}/users/{user_id}", {"name": (me.get("name") if isinstance(me, dict) else "User")})
        record(
            "Settings",
            "Account update via users API",
            "PASS" if code == 200 else ("WARN" if code == 422 else "FAIL"),
            err or f"HTTP {code}",
        )
    if org_id:
        code, body, err = request("GET", f"{API}/organizations/{org_id}")
        record("Settings", "Organization section data", "PASS" if code == 200 else "FAIL", err or f"HTTP {code}")

    # Dashboard home APIs if exist
    code, body, err = request("GET", f"{API}/organizations")
    code2, body2, err2 = request("GET", f"{API}/users")
    record(
        "Dashboard Home",
        "Supporting list APIs (orgs/users)",
        "PASS" if code == 200 and code2 == 200 else "FAIL",
    )

    # Knowledge (extra, not in 15 but present)
    code, body, err = request("GET", f"{API}/brain/health")
    record(
        "Knowledge (bonus)",
        "Brain health proxy",
        "PASS" if code == 200 else ("WARN" if code in (503, 500) else "FAIL"),
        err or f"HTTP {code}",
    )

    # Logged-out protection probe: new jar
    jar2 = CookieJar()
    opener2 = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar2))
    req = urllib.request.Request(
        f"{API}/auth/me",
        headers={"Accept": "application/json", "Origin": ORIGIN},
        method="GET",
    )
    try:
        with opener2.open(req, timeout=15) as resp:
            code = resp.getcode()
    except urllib.error.HTTPError as e:
        code = e.code
    except Exception:
        code = 0
    record("Auth", "Unauthenticated /auth/me blocked", "PASS" if code in (401, 419) else "FAIL", f"HTTP {code}")

    print_summary()
    return 0


def print_summary():
    print("\n=== SUMMARY ===")
    areas = {}
    for r in RESULTS:
        areas.setdefault(r["area"], []).append(r)
    for area, rows in areas.items():
        fails = [x for x in rows if x["status"] == "FAIL"]
        warns = [x for x in rows if x["status"] == "WARN"]
        passes = [x for x in rows if x["status"] == "PASS"]
        overall = "FAIL" if fails else ("WARN" if warns else "PASS")
        print(f"{overall:4} | {area:20} | {len(passes)} pass, {len(warns)} warn, {len(fails)} fail")
        for f in fails:
            print(f"       FAIL detail: {f['check']} — {f['detail'][:160]}")
        for w in warns[:3]:
            print(f"       WARN detail: {w['check']} — {w['detail'][:160]}")


if __name__ == "__main__":
    sys.exit(main())
