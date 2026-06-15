from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....repositories.attendance_repository import attendance_repo
from ....schemas.attendance import Attendance, AttendanceCreate
from ....core.database import get_db

router = APIRouter()

@router.post("/record", response_model=Attendance)
def record_attendance(
    *,
    db: Session = Depends(get_db),
    attendance_in: AttendanceCreate
) -> Any:
    """
    Record attendance.
    """
    return attendance_repo.create(db, obj_in=attendance_in)

@router.get("/student/{student_id}", response_model=List[Attendance])
def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get attendance records for a student.
    """
    return attendance_repo.get_by_student(db, student_id=student_id)

@router.get("/course/{course_id}", response_model=List[Attendance])
def get_course_attendance(
    course_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get attendance records for a course.
    """
    return attendance_repo.get_by_course(db, course_id=course_id)
