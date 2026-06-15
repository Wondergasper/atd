from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    matric_number = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculties.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    level = Column(Integer)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    photo = Column(String)  # Path to photo
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    faculty = relationship("Faculty", back_populates="students")
    department = relationship("Department", back_populates="students")
    biometrics = relationship("BiometricTemplate", back_populates="student")
    attendance = relationship("Attendance", back_populates="student")

class BiometricTemplate(Base):
    __tablename__ = "biometric_templates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    finger_type = Column(String, nullable=False)  # e.g., "RIGHT_THUMB"
    template_data = Column(String, nullable=False)  # Encrypted template string
    quality_score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="biometrics")
