from fastapi import status, HTTPException, Depends, APIRouter, UploadFile, File
from app.utils.image_utils import extractEXIF
from app.database import get_db
from app import models, schemas
from sqlalchemy.orm import Session
from typing import List
import botocore
import boto3

# ------------------------------------------------------------------------------------------------

S3_BUCKET = "prasun-surana-photography"
AWS_REGION = "ap-southeast-1"


router = APIRouter(
    prefix="/posts", # So that we don't have to keep typing the annoying /posts in the routes
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

# Allows upload of images only by admin
@router.post('/upload', response_model=List[schemas.ImageCreate])
def upload_images(country: str, location: str | None = None, files: List[UploadFile] = File(...), 
                  db: Session = Depends(get_db)):

    s3 = boto3.client('s3')
    uploaded_files = []

    for file in files:

        try:

            # Image type validation. The UploadFile class has the attribute content_type, which is the file's 
            # MIME type.
            if not file.content_type.startswith("image"):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                    detail='f"File {file.filename} is not an image')
            
            # Upload the image to S3 bucket and store the URL
            s3_path = f"{country}/{file.filename}"
            # s3.upload_fileobj(file.file, S3_BUCKET, s3_path)
            s3_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{country}/{file.filename}"

            # Get EXIF metadata from each image. This will be added to the metadata database table
            file.file.seek(0) # Move file pointer back to the start
            metadata = extractEXIF(file.file)

            # Populate the Metadata Postgres schema using the metadata Pydantic model and commit to database
            metadata_entry = models.Metadata(**metadata.model_dump())
            db.add(metadata_entry)
            db.commit()
            db.refresh(metadata_entry)

            # Populate the Image Postgres schema using query parameters, commit to database
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


# TODO
# Set up environment variable for S3 URL






