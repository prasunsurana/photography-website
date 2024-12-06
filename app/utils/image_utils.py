from PIL import Image, ExifTags
from fastapi import UploadFile
from app import schemas
import tempfile

def extractEXIF(file: UploadFile) -> schemas.MetadataBase:

  # Temporarily write the image to disk, since Image.open only accepts filepaths as a parameter
  with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
    temp_file.write(file.read())
    tempfile_path = temp_file.name

  image = Image.open(tempfile_path)
  exif_data = image._getexif()
  
  if not exif_data:
    raise ValueError("No EXIF data found in the image")
  
  # Convert Exif Tags to strings
  exif = {ExifTags.TAGS.get(tag, tag): value
          for tag, value in exif_data.items()}
  
  # Unpack exif data into Pydantic model
  metadata = schemas.MetadataBase(**exif)
  
  return metadata