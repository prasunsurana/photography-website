from PIL import Image, ExifTags

image = Image.open('/Users/user/Desktop/Photography/London/DSC_0782.jpg')

data = image._getexif()

if data:
  exif_fields = {ExifTags.TAGS.get(tag): value for tag, value in data.items()}

  for field, value in exif_fields.items():
    print(field, value)
  
else:
  print('no data found')

# Model DateTimeOriginal FNumber ISOSpeedRatings LensModel FocalLength ApertureValue ShutterSpeedValue