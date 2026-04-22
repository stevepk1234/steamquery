from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient
import os

from router.apps import apps_router

MONGO_URI: str = os.getenv("MONGO_URI", "")
DATABASE_NAME: str = os.getenv("MONGO_DB", "")
COLLECTION_NAME: str = os.getenv("MONGO_APPS", "")
STEAM_KEY = os.getenv("STEAM_KEY", "")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = AsyncMongoClient(host=MONGO_URI)
apps = mongo_client[DATABASE_NAME][COLLECTION_NAME]

app.include_router(apps_router)
