from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Biometric Attendance System API"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_read_students_empty():
    # Note: This assumes an empty database or initialized SQLite
    response = client.get("/api/v1/students/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
