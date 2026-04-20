from fastapi import APIRouter, HTTPException, status
from models.models import App
from typing import List
from config.config import settings

apps_router = APIRouter(prefix="/apps", tags=["apps"])

@apps_router.get("/name/{name}", response_model=List[App], status_code=status.HTTP_200_OK)
async def get_app_by_name(name: str):
    from ..main import apps

    regex = {"name": {"$regex": name, "$options": "i"}}
    cursor = apps.find(regex).limit(settings.LIMIT)
    documents = await cursor.to_list(length=settings.LIMIT)

    if not documents:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No apps found matching '{name}'")
    
    return documents

@apps_router.get("/tag/{tag}", response_model=List[App], status_code=status.HTTP_200_OK)
async def get_app_by_tag(tag: str):
    from ..main import apps

    filter_query = {"tags": tag}
    cursor = apps.find(filter_query).limit(settings.LIMIT)
    documents = await cursor.to_list(length=settings.LIMIT)

    if not documents:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No apps found with tag '{tag}'")
    return documents