from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    attendance_date = Column(Date, server_default=func.current_date())
    attendance_time = Column(Time, server_default=func.current_time())
    status = Column(String)  # e.g., "PRESENT", "LATE"
    device_id = Column(Integer, ForeignKey("devices.id"))

    student = relationship("Student", back_populates="attendance")
    course = relationship("Course", back_populates="attendance")
    device = relationship("Device", back_populates="attendance")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    location = Column(String)
    ip_address = Column(String)
    latency = Column(String)
    status = Column(String)  # e.g., "ONLINE", "OFFLINE"
    last_seen = Column(DateTime(timezone=True), onupdate=func.now())

    attendance = relationship("Attendance", back_populates="device")
