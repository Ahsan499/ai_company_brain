from fastapi.testclient import TestClient

from app.main import app


def test_drive_auth_status_unauthenticated_without_token():
    client = TestClient(app)
    response = client.get("/drive/auth-status")
    assert response.status_code == 200
    payload = response.json()
    assert "authenticated" in payload
    assert isinstance(payload["authenticated"], bool)
