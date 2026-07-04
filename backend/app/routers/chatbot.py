from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Product
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    if not os.getenv("GEMINI_API_KEY"):
        return {"response": "Gemini API key is not configured. Please set the GEMINI_API_KEY in your backend/.env file."}
        
    try:
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
    except Exception as e:
        return {"response": f"An error occurred while generating chatbot response: {str(e)}"}