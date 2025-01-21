import schemas
import models
import jwt
from passlib.context import CryptContext
from datetime import datetime 
from models import User, TokenTable
from database import Base, engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from auth_bearer import JWTBearer
from schemas import UserDelete
from functools import wraps
from uuid import UUID, uuid4
from fastapi.middleware.cors import CORSMiddleware
from utils import create_access_token, create_refresh_token

# Configuration de l'algorithme de hachage
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fonction pour hacher le mot de passe
def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

# Fonction pour vérifier le mot de passe
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 jours
ALGORITHM = "HS256"
JWT_SECRET_KEY = "narscbjim@$@&^@&%^&RFghgjvbdsha"   # doit être gardé secret
JWT_REFRESH_SECRET_KEY = "13ugfdfgh@#$%^@&jkl45678902"

Base.metadata.create_all(engine)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

app = FastAPI()

origins = [
    "http://localhost:3000"
    # "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.post("/register")
def register_user(user: schemas.UserCreate, session: Session = Depends(get_session)):
    existing_user = session.query(models.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hachage du mot de passe
    encrypted_password = get_hashed_password(user.password)

    # Utilisation du mot de passe haché
    new_user = models.User(username=user.username, email=user.email, password=encrypted_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "user created successfully"}

@app.post('/login', response_model=schemas.TokenSchema)
def login(request: schemas.requestdetails, db: Session = Depends(get_session)):
    user = db.query(User).filter(User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email")
    
    hashed_pass = user.password
    if not verify_password(request.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)

    token_db = models.TokenTable(user_id=user.id, access_toke=access, refresh_toke=refresh, status=True)
    db.add(token_db)
    db.commit()
    db.refresh(token_db)
    
    return {
        "access_token": access,
        "refresh_token": refresh,
    }
    
    
@app.get('/getusers')
def getusers( dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    user = session.query(models.User).all()
    return user

@app.post("/change-password")
def change_password(request: schemas.changepassword, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")
    encrypted_password = get_hashed_password(request.new_password)
    user.password = encrypted_password
    db.commit()
    
    return {"message": "Password changed successfully"}




@app.post('/logout')
def logout(dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    token_record = db.query(models.TokenTable).all()
    info=[]
    for record in token_record :
        print("record",record)
        if (datetime.utcnow() - record.created_date).days >1:
            info.append(record.user_id)
    if info:
        existing_token = db.query(models.TokenTable).where(TokenTable.user_id.in_(info)).delete()
        db.commit()
        
    existing_token = db.query(models.TokenTable).filter(models.TokenTable.user_id == user_id, models.TokenTable.access_toke==token).first()
    if existing_token:
        existing_token.status=False
        db.add(existing_token)
        db.commit()
        db.refresh(existing_token)
    return {"message":"Logout Successfully"}


@app.delete("/users/{user_id}")
def delete_user(user_id: UUID, session: Session = Depends(get_session)):
    user = session.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    session.delete(user)
    session.commit()
    
    return {"message": "User deleted successfully"}



@app.delete("/users/")
def delete_multiple_users(user_delete: UserDelete, session: Session = Depends(get_session)):
    users = session.query(models.User).filter(models.User.id.in_(user_delete.user_ids)).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found with the provided IDs")
    
    for user in users:
        session.delete(user)
    
    session.commit()
    
    return {"message": f"{len(users)} users deleted successfully"}

# def create_book(db: Session, book: schemas.BookCreate):
#     db_book = models.Book(title=book.title, author_id=book.author_id, content=book.content)
#     db.add(db_book)
#     db.commit()
#     db.refresh(db_book) 
    