from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from .schemas import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, nullable=False) # nullable means cannot be a null value
    metadata_id = Column(Integer, ForeignKey("metadata.id", ondelete="CASCADE"), nullable=False)
    country = Column(String, nullable=False)
    location = Column(String, nullable=False)
    s3_url = Column(String, nullable=False)
    

class Metadata(Base):
    __tablename__ = "metadata"

    id = Column(Integer, primary_key=True, nullable=False)
    date = Column(TIMESTAMP(timezone=True), nullable=False)
    model = Column(String, nullable=False)
    lens_model = Column(String, nullable=False)
    f_number = Column(String, nullable=False)
    focal_length = Column(String, nullable=False)
    aperture_value = Column(String, nullable=False)
    shutter_speed = Column(String, nullable=False)
    ISO = Column(Integer, nullable=False)