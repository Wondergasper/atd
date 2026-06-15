from app import models
from app.core.database import SessionLocal
from app.models.student import Student

db = SessionLocal()
try:
    print("Attempting to query students...")
    students = db.query(Student).all()
    print(f"Success! Found {len(students)} students.")
    for s in students:
        print(f"Student: {s.first_name} {s.last_name}, Faculty: {s.faculty.name if s.faculty else 'None'}")
except Exception as e:
    print(f"FAILED: {e}")
finally:
    db.close()
