from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, schemas, models
from ..utils import auth_utils as au

''' This has only been used once to add admin details to database. Do not use this endpoint again
unless there is another user to be added with admin privileges.'''


router = APIRouter(
  tags=['User Management']
)

# This is only for admin privileges. No other addition should be made to the users table
@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):

  hashed_password = au.hash(user.password)
  user.password = hashed_password

  user_post = models.User(**user.model_dump())

  db.add(user_post)
  db.commit()
  db.refresh(user_post)

  entry = db.query(models.User).filter(models.User.username == user.username).first()

  user_out = schemas.UserOut(
    id=entry.id,
    email=entry.username
  )

  return user_out