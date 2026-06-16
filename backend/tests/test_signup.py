from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_duplicate_email():
    # Attempt to sign up a user with a duplicate email (already used by admin)
    payload = {
        "username": "new_unique_username_123",
        "email": "admin@university.edu", # existing email
        "password": "password123",
        "full_name": "Unique Name",
        "role": "Admin"
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    print("Response status:", response.status_code)
    print("Response JSON:", response.json() if response.headers.get("content-type") == "application/json" else response.text)
    assert response.status_code == 400
