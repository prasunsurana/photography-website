from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings

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

class ImageCreate(BaseModel):
   country: str
   location: str
   s3_url: str
   metadata: MetadataBase

# Pydantic schema for defining database environment variables class
class Settings(BaseSettings):
  database_hostname: str
  database_port: str
  database_username: str
  database_password: str
  database_name: str
  secret_key: str
  algorithm: str

  # To tell Pydantic to import from .env file
  class Config:
      env_file = '.env'

settings = Settings()



