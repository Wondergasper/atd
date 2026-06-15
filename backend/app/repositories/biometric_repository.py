from sqlalchemy.orm import Session
from .base import BaseRepository
from ..models.student import BiometricTemplate
from ..schemas.biometric import BiometricTemplateCreate

class BiometricRepository(BaseRepository[BiometricTemplate, BiometricTemplateCreate, BiometricTemplateCreate]):
    def get_by_student_id(self, db: Session, student_id: int):
        return db.query(self.model).filter(self.model.student_id == student_id).all()

biometric_repo = BiometricRepository(BiometricTemplate)
