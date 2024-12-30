from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..backend import database, schemas, models, oauth
from ..utils import auth_utils as au

router = APIRouter(
  tags=['Authentication']
)

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):

  user = db.query(models.User).filter(models.User.username == user_credentials.username).first()

  if not user:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                        detail="This user does not exist")
  
  if not au.verify(user_credentials.password, user.password):
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                        detail="Invalid Credentials: Password is incorrect")
  
  access_token = oauth.create_access_token(data={'user_id':user.id})
  print(access_token)

  return {"access_token": access_token, "token_type": "Bearer"}