from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional

class AttendanceBase(BaseModel):
    student_id: int
    course_id: int
    status: Optional[str] = "PRESENT"
    device_id: Optional[int] = None

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    attendance_date: date
    attendance_time: time

    class Config:
        from_attributes = True
