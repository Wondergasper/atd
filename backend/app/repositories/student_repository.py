from sqlalchemy.orm import Session
from .base import BaseRepository
from ..models.student import Student
from ..schemas.student import StudentCreate, StudentUpdate

class StudentRepository(BaseRepository[Student, StudentCreate, StudentUpdate]):
    def get_by_matric_number(self, db: Session, matric_number: str):
        return db.query(self.model).filter(self.model.matric_number == matric_number).first()

student_repo = StudentRepository(Student)
