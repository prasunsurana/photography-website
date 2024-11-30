from fastapi import status, HTTPException, Depends, APIRouter, UploadFile, File
from app.utils.image_utils import extractEXIF
from ..utils.s3_utils import s3FilePathExtract
from app.database import get_db
from app import models, schemas, oauth
from sqlalchemy.orm import Session
from sqlalchemy import delete
from string import Template
from typing import List
from io import BytesIO
import botocore
import boto3
import os

# ------------------------------------------------------------------------------------------------

S3_BUCKET = "prasun-surana-photography"
AWS_REGION = "ap-southeast-1"

# Dependency for posting to/deleting from S3
def get_s3_client():
    return boto3.client('s3')


router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

# ------------------------------------------------------------------------------------------------

# Returns all posts matching a location
@router.get('/{location}', response_model=List[schemas.ImageCreate])
def get_images(location: str, db: Session = Depends(get_db),
                     limit: int = 10,  skip: int = 0):
  
  images = db.query(models.Image).filter(models.Image.country.contains(location))\
      .limit(limit).offset(skip).all()
   
  return images

# ------------------------------------------------------------------------------------------------

# Allows upload of images only by admin, File(...) is to allow multiple file uploads on Swagger UI
@router.post('/upload', response_model=List[schemas.ImageCreate])
def upload_images(country: str, location: str | None = None, files: List[UploadFile] = File(...), 
                  db: Session = Depends(get_db), s3 = Depends(get_s3_client),
                  current_user = Depends(oauth.get_current_user)):

    uploaded_files = []

    for file in files:

        try:

            # Image type validation
            if not file.content_type.startswith("image"):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                    detail=f"File {file.filename} is not an image")
            
            # Get S3 URL template from environment variable
            url_template = os.getenv('AWS_S3_URL')
            if not url_template:
                raise ValueError("AWS_S3_URL environment variable is not set")
            
            file_content = file.file.read()
            byte_stream = BytesIO(file_content)
            
            # Upload image to S3 bucket
            s3_path = f"{country}/{file.filename}"
            s3.upload_fileobj(byte_stream, S3_BUCKET, s3_path)
            
            # Populate S3 URL template
            template = Template(url_template)
            s3_url = template.substitute(
                bucket=S3_BUCKET, 
                region=AWS_REGION, 
                country=country, 
                filename=file.filename)

            # Get EXIF metadata from each image 
            file.file.seek(0) # Move file pointer back to the start
            metadata = extractEXIF(file.file)
            
            # Populate the Metadata Postgres schema using the metadata Pydantic model
            metadata_entry = models.MetadataImg(**metadata.model_dump())

            # Database commits
            db.add(metadata_entry)
            db.commit()
            db.refresh(metadata_entry)

            # Populate the Image Postgres schema using query parameters
            image_entry = models.Image(
                metadata_id=metadata_entry.id, # Postgres keeps track of last added entry, so we can access the metadata id
                country=country,
                location=location,
                s3_url=s3_url
            )

            db.add(image_entry)
            db.commit()
            db.refresh(image_entry)

            # Define Pydantic model for return, only for API testing
            return_schema = schemas.ImageCreate(
                country=country,
                location=location,
                s3_url=s3_url,
                metadata=metadata_entry
            )

            uploaded_files.append(return_schema)

        except HTTPException:
            raise 
        
        except botocore.exceptions.ClientError as e:
            db.rollback()
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            print(f"ClientError: {error_code} - {error_message}")

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Error processing file {file.file}: {str(e)}")
        

    return uploaded_files


@router.delete('/{location}')
def delete_post(url: str, db: Session = Depends(get_db), s3 = Depends(get_s3_client),
                current_user = Depends(oauth.get_current_user)):
    
    # Delete from S3
    s3_key = s3FilePathExtract(url)
    s3.delete_object(Bucket=S3_BUCKET, Key=s3_key)

    try:
        # Query image from database
        to_delete = db.query(models.Image).filter(models.Image.s3_url == url).first()
        if not to_delete:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Image not found")
        
        # Query associated metadata and delete
        db.query(models.MetadataImg).filter(models.MetadataImg.id == to_delete.metadata_id).delete()

        # Delete image from database
        print(to_delete)
        db.delete(to_delete)
        db.commit()
        print('successfully deleted')
    except Exception as e:
        db.rollback()
        print(e)
    finally:
        db.close()


# Add user authentication to create and delete posts

# TO DO
# In HTML, the way to display an image will be <img src=[THE AWS URL HERE]...>
# When clicking a picture, the DOM will query that element, and then when you press delete,
# it will take the AWS URL from src in the <img> tag, query that in the Postgres database,
# delete it, and then delete it from the S3 bucket.
# We want to implement an 'Are you sure' alert as well when deleting