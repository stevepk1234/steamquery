from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class App(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    appid: int = Field(alias="_id")    # uid
    added_date: str         # ISO 8601 format YYYY-MM-DDTHH:mm:ss.SSSSSS±HH:MM
    dlc: list[int]          # array of appids
    drm: bool               # certification digital rights management
    header_image: str       # saved PNGs for steam page
    name: str           
    nsfw: bool
    tags: list[str]         # genre
    type: str               # mutually exclusive: game, dlc, demo, tool
    updated_date: str
    
class User(BaseModel):
    steamid: int            # uuid
    owned_games: list[App]  # list of owned games