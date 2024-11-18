from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..app.schemas import settings

import os
import boto3
from ..app.schemas import ImageBase

FILEPATH = '/Users/user/Desktop/Photography'
BUCKET_NAME = 'prasun-surana-photography'

# Go through log file, get a list of all locations uploaded to Amazon S3 bucket
locations = []
with open('db_update.txt') as f:
  for line in f:
    log_message = line.strip()
    locations.append(log_message[-1].strip()) # .strip() to remove newline character

photo_albums = os.listdir(FILEPATH)
print(photo_albums)


# Connect to S3
s3 = boto3.client('s3')
bucket = 'prasun-surana-photography'

# If there is a new album, upload it to S3
for album in photo_albums:
  if album not in locations:

    folder_path = f'{FILEPATH}/{album}'

    # Connect to Postgres database
    SQLALCHEMY_DATABASE_URL = f'''postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'''
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    for root, dirs, files in os.walk(folder_path):
      for file in files:

        if file.startswith('.'): 
          continue

        file_path = f'{folder_path}/{file}'
        s3_key = f'{album}/{file}'

        try:

          s3.upload_file(str(file_path), BUCKET_NAME, s3_key)
        except:
          raise Exception('Upload failed')





