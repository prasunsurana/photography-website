from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import public, auth, user
from app.database import engine
from app import models

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

# app.include_router(admin)
app.include_router(public.router)
app.include_router(auth.router)
app.include_router(user.router)