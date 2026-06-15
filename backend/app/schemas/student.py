from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class StudentBase(BaseModel):
    matric_number: str
    first_name: str
    last_name: str
    faculty_id: Optional[int] = None
    department_id: Optional[int] = None
    level: Optional[int] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    photo: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    matric_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class Student(StudentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
