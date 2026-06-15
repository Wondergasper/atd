from app.core.database import engine, Base
# Import all models here for SQLAlchemy to detect them
from app.models.student import Student, BiometricTemplate
from app.models.attendance import Attendance, Device
from app.models.course import Course
from app.models.user import User
from app.models.organization import Faculty, Department

def init_db():
    print("Initializing the database...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()
