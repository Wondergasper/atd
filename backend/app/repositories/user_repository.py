from sqlalchemy.orm import Session
from .base import BaseRepository
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core import security

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    def get_by_username(self, db: Session, username: str):
        return db.query(self.model).filter(self.model.username == username).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(self.model).filter(self.model.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            hashed_password=security.get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return security.verify_password(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return security.get_password_hash(password)

user_repo = UserRepository(User)
