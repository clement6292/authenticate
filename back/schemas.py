from pydantic import BaseModel
import datetime
from uuid import UUID
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class requestdetails(BaseModel):
    email:str
    password:str
        
class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str

class changepassword(BaseModel):
    email:str
    old_password:str
    new_password:str

class TokenCreate(BaseModel):
    user_id:str
    access_token:str
    refresh_token:str
    status:bool
    created_date:datetime.datetime
    
class UserDelete(BaseModel):
    user_ids: list[UUID]
    
    
class Products(BaseModel):
    title: str
    description:str
    at_sale: bool = False
    inventory:int
    
# class BookBase(BaseModel):
#     title: str
#     author_id: int
#     content: Optional[str] = None  # New content field    
    