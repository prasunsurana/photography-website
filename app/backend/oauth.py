from jose import JWTError, jwt
from datetime import datetime, timedelta
from .import schemas, database, models
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .schemas import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/login')

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp': expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def verify_access_token(token: str, credentials_exception):

    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        id = str(payload.get("user_id"))
        if id is None:
            raise credentials_exception
        
        token_data = schemas.TokenData(id=id)

    except JWTError:
        raise credentials_exception
    
    return token_data
    
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail=f'Could not validate credentials',
                                          headers={'WWW-Authenticate':'Bearer'})
    
    token = verify_access_token(token, credentials_exception)
    user = db.query(models.User).filter(models.User.id == token.id).first()

    print(token)
    print(user)

    return user
    

# When, for example, the login endpoint is accessed, it returns a dictionary containing the token.
# This token is not stored in memory, but it is up to the developer what to do with it.
# So, because in the frontend, the admin (me) is logging in, JS would fetch the API login endpoint, 
# and save the token into memory using localStorage, or save as an environment variable.
# When another endpoint that requires authentication is accessed, JS will fetch that endpoint and
# include the token under the 'Authentication' header. Once it validates the token, the action will
# be authorized. 