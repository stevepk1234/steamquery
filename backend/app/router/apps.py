from fastapi import APIRouter, HTTPException, status
from app.models.models import App
from pydantic import BaseModel
from typing import List
from app.config.config import settings
import httpx

apps_router = APIRouter(prefix="/apps", tags=["apps"])


class PriceOverview(BaseModel):
    currency: str = ""
    initial: int = 0
    final: int = 0
    discount_percent: int = 0
    initial_formatted: str = ""
    final_formatted: str


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


@apps_router.get("/price/{appid}", response_model=PriceOverview, status_code=status.HTTP_200_OK)
async def get_price_by_appid(appid: int):
    url = f"https://store.steampowered.com/api/appdetails/?appids={appid}&cc=us&filters=price_overview"
    async with httpx.AsyncClient() as client:
        res = await client.get(url, timeout=8.0)

    if res.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Steam API error")

    data = res.json()
    entry = data.get(str(appid), {})
    entry_data = entry.get("data")
    price_overview = entry_data.get("price_overview") if isinstance(entry_data, dict) else None

    if not entry.get("success") or not price_overview:
        return PriceOverview(final_formatted="Free to Play")

    return PriceOverview(**price_overview)
