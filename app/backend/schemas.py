from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings
from typing import Optional

# ---------------------------------------------------------------------------

# Pydantic schema for uploading image metadata to Postgres database
class MetadataBase(BaseModel):
  DateTimeOriginal: str
  Model: str
  LensModel: str
  FNumber: float
  FocalLength: float
  ApertureValue: float
  ShutterSpeedValue: float
  ISOSpeedRatings: int

  class Config:
    extra = "ignore" # Ignore any extra fields not defined in the model
    from_attributes = True

# ---------------------------------------------------------------------------

class ImageCreate(BaseModel):
   country: str
   location: str
   s3_url: str
   metadata: MetadataBase | None = None

# ---------------------------------------------------------------------------

class Token(BaseModel):
   access_token: str
   token_type: str

# ---------------------------------------------------------------------------

class TokenData(BaseModel):
    id: Optional[str] = None

# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    username: EmailStr
    password: str

    class Config:
        from_attributes = True

# ---------------------------------------------------------------------------

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# ---------------------------------------------------------------------------

class Subscriber(BaseModel):
   id: int
   email: EmailStr

   class Config:
      from_attributes = True


# Pydantic schema for defining database environment variables class
class Settings(BaseSettings):
  database_hostname: str
  database_port: str
  database_username: str
  database_password: str
  database_name: str
  secret_key: str
  algorithm: str
  access_token_expire_minutes: int

  # To tell Pydantic to import from .env file
  class Config:
      env_file = '.env.database'

settings = Settings()