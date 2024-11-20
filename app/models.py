from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from .database import Base

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
    DateTimeOriginal = Column(String, nullable=False)
    Model = Column(String, nullable=False)
    LensModel = Column(String, nullable=False)
    FNumber = Column(String, nullable=False)
    FocalLength = Column(String, nullable=False)
    ApertureValue = Column(String, nullable=False)
    ShutterSpeedValue = Column(String, nullable=False)
    ISOSpeedRatings = Column(Integer, nullable=False)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String) # This will be a hashed password, so if database is breached, security is not
                              # compromised
