from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, nullable=False) # nullable means cannot be a null value
    metadata_id = Column(Integer, ForeignKey("metadataimg.id", ondelete="CASCADE"), nullable=False)
    country = Column(String, nullable=False)
    location = Column(String, nullable=False)
    s3_url = Column(String, nullable=False)

    # Define relationship to image to ensure cascading behaviour upon deletion
    metadataimg = relationship("MetadataImg", back_populates="images")

    def __repr__(self):
        return f'''ID: {self.id}
                Metadata ID: {self.metadata_id}
                Country: {self.country}
                Location: {self.location}
                S3 URL: {self.s3_url}
                '''
    

class MetadataImg(Base):
    __tablename__ = "metadataimg"

    id = Column(Integer, primary_key=True, nullable=False)
    DateTimeOriginal = Column(String, nullable=False)
    Model = Column(String, nullable=False)
    LensModel = Column(String, nullable=False)
    FNumber = Column(String, nullable=False)
    FocalLength = Column(String, nullable=False)
    ApertureValue = Column(String, nullable=False)
    ShutterSpeedValue = Column(String, nullable=False)
    ISOSpeedRatings = Column(Integer, nullable=False)

    # Define relationship to image to ensure cascading behaviour upon deletion
    images = relationship("Image", cascade="all,delete", back_populates="metadataimg")

    def __repr__(self):
        return f'''ID: {self.id}
                DateTime: {self.DateTimeOriginal}
                Model: {self.Model}
                Lens Model: {self.LensModel}
                F Number: {self.FNumber}
                Focal Length: {self.FocalLength}
                Aperture: {self.ApertureValue}
                Shutter Speed: {self.ShutterSpeedValue}
                ISO: {self.ISOSpeedRatings}
                '''


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False) # This will be a hashed password, so if database is breached, security is not
                              # compromised

    def __repr__(self):
        return f'''ID: {self.id}
                Username: {self.username}
                Password:{self.password}
                '''
    

class Subscribers(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return f'''ID: {self.id}
                Email Address: {self.email}
                '''