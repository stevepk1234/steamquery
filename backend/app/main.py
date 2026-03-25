from fastapi import FastAPI
from pymongo import AsyncMongoClient

def main():
    print("Hello from backend!")

# TODO: constants should be set in .env
MONGO_URI = ""
DATABASE_NAME = ""
COLLECTION_NAME = ""

mongo_client = AsyncMongoClient(host=MONGO_URI)

apps = mongo_client[DATABASE_NAME][COLLECTION_NAME]

if __name__ == "__main__":
    main()
