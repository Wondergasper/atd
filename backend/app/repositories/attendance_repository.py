from sqlalchemy.orm import Session
from .base import BaseRepository
from ..models.attendance import Attendance
from ..schemas.attendance import AttendanceCreate

class AttendanceRepository(BaseRepository[Attendance, AttendanceCreate, AttendanceCreate]):
    def get_by_student(self, db: Session, student_id: int):
        return db.query(self.model).filter(self.model.student_id == student_id).all()

    def get_by_course(self, db: Session, course_id: int):
        return db.query(self.model).filter(self.model.course_id == course_id).all()

attendance_repo = AttendanceRepository(Attendance)
