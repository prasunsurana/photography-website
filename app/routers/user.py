from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..backend import database, schemas, models
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from ..utils import auth_utils as au
from dotenv import load_dotenv
from typing import List
import smtplib
import os

# ------------------------------------------------------------------------------------------------

load_dotenv(dotenv_path=".env.email")

EMAIL_ADDRESS=os.getenv('EMAIL_ADDRESS')
PASSWORD=os.getenv('EMAIL_PASSWORD')

router = APIRouter(
  tags=['User Management']
)

# ------------------------------------------------------------------------------------------------

''' This has only been used once to add admin details to database. Do not use this endpoint again
unless there is another user to be added with admin privileges.'''

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

# ------------------------------------------------------------------------------------------------

@router.post('/subscribe', response_model=schemas.Subscriber)
def create_subscriber(email: str, db: Session = Depends(database.get_db)):

  subscriber = db.query(models.Subscribers).filter(models.Subscribers.email == email).first()
  if subscriber:
    raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                        detail='There is already a subscriber under this email')

  subscriber_post = models.Subscribers(email=email)

  db.add(subscriber_post)
  db.commit()
  db.refresh(subscriber_post)

  subscriber_out = schemas.Subscriber(id=subscriber_post.id,
                                      email=subscriber_post.email)
  
  return subscriber_out

# ------------------------------------------------------------------------------------------------

@router.post('/notify', response_model = List[schemas.Subscriber])
def notify_subscribers(country: str, db: Session = Depends(database.get_db)):

  subscribers = db.query(models.Subscribers).all()

  if not subscribers:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail="There are no subscribers to notify")
  
  subscribers = [schemas.Subscriber(id=sub.id, email=sub.email) for sub in subscribers]
  recipients = [sub.email for sub in subscribers]

  subject = 'New Album | Prasun Surana Photography'
  body = f"""
  Hey!
  
  A new album from {country} just dropped! Check it out at the link below:

  127.0.0.1:8000/portfolio?country={country}

  Hope you enjoy!

  Prasun
  """

  try:
    # Create MIME message for each recipient
    msg = MIMEMultipart()
    msg['From'] = formataddr(('Prasun Surana Photography', EMAIL_ADDRESS))
    msg['To'] = ', '.join(recipients)
    msg['Subject'] = subject
    body = MIMEText(body, 'plain')
    msg.attach(body)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
      smtp_server.login(EMAIL_ADDRESS, PASSWORD)
      smtp_server.sendmail(EMAIL_ADDRESS, recipients, msg.as_string())

    return subscribers

  except Exception as e:
      print(e)
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                          detail="Failed to send email")
  