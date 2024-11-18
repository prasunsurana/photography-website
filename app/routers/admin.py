from .. import models, schemas, oauth
from ..database import engine, get_db
from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

router = APIRouter(
    tags=["Authentication"]
)



