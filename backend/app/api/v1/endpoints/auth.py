from typing import Any, List, Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....repositories.user_repository import user_repo
from ....core import security
from ....schemas.user import Token, User, UserCreate, UserUpdate

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = user_repo.get_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = security.timedelta(minutes=30)
    return {
        "access_token": security.create_access_token(
            user.username, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/signup", response_model=User)
def signup(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    user = user_repo.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    return user_repo.create(db, obj_in=user_in)

@router.get("/users", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve users.
    """
    return user_repo.get_multi(db, skip=skip, limit=limit)

@router.put("/users/{id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(get_db),
    id: int,
    user_in: UserUpdate
) -> Any:
    """
    Update a user.
    """
    user = user_repo.get(db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Handle password hashing if provided
    if user_in.password:
        user.hashed_password = security.get_password_hash(user_in.password)
        
    return user_repo.update(db, db_obj=user, obj_in=user_in)

@router.post("/change-password")
def change_password(
    *,
    db: Session = Depends(get_db),
    current_password: str,
    new_password: str,
    username: str # In production, get this from current_user dependency
) -> Any:
    """
    Change user password.
    """
    user = user_repo.get_by_username(db, username=username)
    if not user or not security.verify_password(current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    user.hashed_password = security.get_password_hash(new_password)
    db.add(user)
    db.commit()
    return {"message": "Password changed successfully"}
