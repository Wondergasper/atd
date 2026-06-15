from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.organization import Faculty, Department
from app.models.student import Student, BiometricTemplate
from app.models.attendance import Attendance, Device
from app.models.course import Course
from app.models.user import User
from app.core.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        print("Seeding database...")
        
        # 1. Create Faculty
        sci_faculty = Faculty(name="Science")
        eng_faculty = Faculty(name="Engineering")
        db.add_all([sci_faculty, eng_faculty])
        db.commit()

        # 2. Create Departments
        cs_dept = Department(name="Computer Science", faculty_id=sci_faculty.id)
        ee_dept = Department(name="Electrical Eng.", faculty_id=eng_faculty.id)
        me_dept = Department(name="Mechanical Eng.", faculty_id=eng_faculty.id)
        db.add_all([cs_dept, ee_dept, me_dept])
        db.commit()

        # 3. Create initial students (matching frontend mockDb.js)
        students_data = [
            {"matric": "CSC/2026/001", "first": "John", "last": "Doe", "email": "john.doe@example.com", "dept_id": cs_dept.id, "level": 100},
            {"matric": "CSC/2026/002", "first": "Jane", "last": "Smith", "email": "jane.smith@example.com", "dept_id": cs_dept.id, "level": 200},
            {"matric": "CSC/2026/003", "first": "Robert", "last": "Johnson", "email": "robert.j@example.com", "dept_id": ee_dept.id, "level": 300},
            {"matric": "CSC/2026/004", "first": "Emily", "last": "Davis", "email": "emily.d@example.com", "dept_id": me_dept.id, "level": 400},
        ]

        for s in students_data:
            student = Student(
                matric_number=s["matric"],
                first_name=s["first"],
                last_name=s["last"],
                email=s["email"],
                department_id=s["dept_id"],
                faculty_id=sci_faculty.id if s["dept_id"] == cs_dept.id else eng_faculty.id,
                level=s["level"]
            )
            db.add(student)
        
        # 4. Create an Admin User
        admin_user = User(
            username="admin",
            email="admin@university.edu",
            hashed_password=get_password_hash("password123"),
            full_name="System Administrator",
            role="Admin",
            is_active=True
        )
        db.add(admin_user)

        db.commit()
        print("Database seeded successfully.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
