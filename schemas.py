from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings
from datetime import datetime
from typing import Optional

# Pydantic schema for uploading image metadata to Postgres database
class ImageBase(BaseModel):
  datetime_original: str
  model: str
  lens_model: str
  f_number: str
  focal_length: str
  aperture_value: str
  shutter_speed_value: str
  photographic_sensitivity: str
  s3_url: str

  class Config:
    extra = "ignore" # Ignore any extra fields not defined in the model


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



