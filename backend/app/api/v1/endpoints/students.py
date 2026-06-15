from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....repositories.student_repository import student_repo
from ....schemas.student import Student, StudentCreate, StudentUpdate
from ....core.database import get_db

router = APIRouter()

@router.get("/", response_model=List[Student])
def read_students(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve students.
    """
    students = student_repo.get_multi(db, skip=skip, limit=limit)
    return students

@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
def create_student(
    *,
    db: Session = Depends(get_db),
    student_in: StudentCreate
) -> Any:
    """
    Create new student.
    """
    student = student_repo.get_by_matric_number(db, matric_number=student_in.matric_number)
    if student:
        raise HTTPException(
            status_code=400,
            detail="A student with this matric number already exists.",
        )
    return student_repo.create(db, obj_in=student_in)

@router.get("/{id}", response_model=Student)
def read_student(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Get student by ID.
    """
    student = student_repo.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{id}", response_model=Student)
def update_student(
    *,
    db: Session = Depends(get_db),
    id: int,
    student_in: StudentUpdate
) -> Any:
    """
    Update a student.
    """
    student = student_repo.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student_repo.update(db, db_obj=student, obj_in=student_in)

@router.delete("/{id}", response_model=Student)
def delete_student(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Delete a student.
    """
    student = student_repo.get(db, id=id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student_repo.remove(db, id=id)
