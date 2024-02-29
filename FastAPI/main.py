from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
origins = [
    "http://localhost:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str
    
class TransactionModel(TransactionBase):
    id: int
    class Config:
        orm_mode = True 

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()    
        
# db_dependency = Annotated[Session, Depends(get_db)]     
db_dependency = Depends(get_db)       
        
models.Base.metadata.create_all(bind=engine)

@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db:Session = db_dependency):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db:Session = db_dependency, skip:int = 0, limit:int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

@app.get("/transactions/{transaction_id}", response_model=TransactionModel)
async def read_transaction(transaction_id: int, db: Session = db_dependency):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        return db_transaction
    else:
        raise HTTPException(status_code=404, detail="Transaction not found")

@app.put("/transactions/{transaction_id}", response_model=TransactionModel)
async def update_transaction(
    transaction_id: int, transaction: TransactionBase, db: Session = db_dependency
):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        for key, value in transaction.dict().items():
            setattr(db_transaction, key, value)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    else:
        raise HTTPException(status_code=404, detail="Transaction not found")

@app.delete("/transactions/{transaction_id}", response_model=TransactionModel)
async def delete_transaction(transaction_id: int, db: Session = db_dependency):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return db_transaction
    else:
        raise HTTPException(status_code=404, detail="Transaction not found")