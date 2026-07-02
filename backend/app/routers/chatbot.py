from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.product import Product
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    products = db.query(Product).all()
    users = db.query(User).all()
    
    product_info = "\n".join([
        f"- {p.product_name}, Stock: {p.current_quantity}, Price: {p.price}"
        for p in products
    ])
    
    context = f"""
    You are an AI assistant for an Inventory Management System.
    
    Current Inventory:
    {product_info}
    
    Total Users: {len(users)}
    
    Answer questions about inventory based on this data only.
    Keep answers short and helpful.
    """
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(
        context + "\n\nUser Question: " + request.message
    )
    
    return {"response": response.text}