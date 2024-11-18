from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

# allow methods also allows us to control which type of requests are permitted, such as POST, PUT, etc
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
)