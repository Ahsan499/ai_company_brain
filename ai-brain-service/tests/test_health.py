from fastapi.testclient import TestClient

from app.main import app


def test_health_endpoint_returns_ok_and_chroma_status():
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert isinstance(payload["chroma_connected"], bool)


def test_api_v1_health_alias_returns_ok():
    client = TestClient(app)
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert isinstance(payload["chroma_connected"], bool)
