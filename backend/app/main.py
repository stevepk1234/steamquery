from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient
import os

# TODO: constants should be set in .env
MONGO_URI: str = os.getenv('MONGO_URI')
DATABASE_NAME: str = os.getenv('MONGO_DB')
COLLECTION_NAME: str = os.getenv('MONGO_APPS')

STEAM_KEY = os.getenv('STEAM_KEY')

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

mongo_client = AsyncMongoClient(host=MONGO_URI)
apps = mongo_client[DATABASE_NAME][COLLECTION_NAME]

@app.get("/")
async def root():
    return {
        "message": "Backend running as expected."
    }

@app.get("/apps")
def get_app(name: str, limit: int):
    if (app := apps.find({"name": name}).limit(limit)) is not None:
        return app
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"App with name {name} not found")

if __name__ == "__main__":
    main()
