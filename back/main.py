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
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware
from utils import create_access_token, create_refresh_token
from fastapi import UploadFile, File, Form
import json
import os 
from fastapi.staticfiles import StaticFiles
from schemas import Products


UPLOAD_DIRECTORY = "uploads/"

# Configuration de l'algorithme de hachage
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fonction pour hacher le mot de passe
def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

# Fonction pour vérifier le mot de passe
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 jours
ALGORITHM = "HS256"
JWT_SECRET_KEY = "narscbjim@$@&^@&%^&RFghgjvbdsha"  # doit être gardé secret
JWT_REFRESH_SECRET_KEY = "13ugfdfgh@#$%^@&jkl45678902"

Base.metadata.create_all(engine)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

app = FastAPI()

# Monte le dossier uploads pour servir les fichiers statiques
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

origins = [
    "http://localhost:3000"
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
def getusers(dependencies=Depends(JWTBearer()), session: Session = Depends(get_session)):
    user = session.query(models.User).all()
    return user

@app.post("/change-password")
def change_password(request: schemas.changepassword, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid old password")
    encrypted_password = get_hashed_password(request.new_password)
    user.password = encrypted_password
    db.commit()
    
    return {"message": "Password changed successfully"}

@app.post('/logout')
def logout(dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    token = dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    token_record = db.query(models.TokenTable).all()
    info = []

    for record in token_record:
        if (datetime.utcnow() - record.created_date).days > 1:
            info.append(record.user_id)

    if info:
        existing_token = db.query(models.TokenTable).where(TokenTable.user_id.in_(info)).delete()
        db.commit()
        
    existing_token = db.query(models.TokenTable).filter(models.TokenTable.user_id == user_id, models.TokenTable.access_toke == token).first()
    
    if existing_token:
        existing_token.status = False
        db.add(existing_token)
        db.commit()
        db.refresh(existing_token)

    return {"message": "Logout Successfully"}

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


@app.post('/product', status_code=status.HTTP_201_CREATED, response_model=schemas.Products)
async def create(
    title: str = Form(...),
    description: str = Form(...),
    at_sale: bool = Form(...),
    inventory: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_session)
):
    # Assurez-vous que le dossier de téléchargement existe
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

    # Générer un chemin de fichier unique pour éviter les conflits
    file_location = os.path.join(UPLOAD_DIRECTORY, image.filename)

    # Sauvegarder le fichier
    with open(file_location, "wb") as file:
        file.write(await image.read())

    # Enregistrer le nom de fichier au lieu du chemin complet
    new_product = models.Product(
        title=title,
        description=description,
        image=image.filename,  # Sauvegardez seulement le nom de fichier
        at_sale=at_sale,
        inventory=inventory
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
        
        


@app.get("/product")
def get(db: Session = Depends(get_session)):
    all_products = db.query(models.Product).all()
    
    # Construire l'URL complète pour l'image
    for product in all_products:
        product.image = f"http://127.0.0.1:8000/uploads/{product.image}"  # Ajoute l'URL complète
    
    return all_products

@app.delete("/delete/{id}")
def delete(id: int, db: Session = Depends(get_session), status_code=status.HTTP_204_NO_CONTENT):
    delete_post = db.query(models.Product).filter(models.Product.id == id)
    if delete_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with such id does not exist")
    else:
        delete_post.delete(synchronize_session=False)
        db.commit()
    return {"message": "Produit supprimé avec succès"}

@app.put("/update/{id}")
def update(id: int, product: schemas.Products, db: Session = Depends(get_session)):
    updated_post = db.query(models.Product).filter(models.Product.id == id)
    if updated_post.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Product with such id: {id} does not exist')
    else:
        updated_post.update(product.dict(), synchronize_session=False)
        db.commit()
    return updated_post.first()