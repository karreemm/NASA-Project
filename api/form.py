from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
import base64
from typing import Optional

router = APIRouter()

client = MongoClient("mongodb://127.0.0.1:27017")  
db = client['nasa-form']  
collection = db['contribute']  

class FormData(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    planet_name: Optional[str] = None
    constellation_name: Optional[str] = None
    drawing: Optional[str] = None  

@router.post("/submit_form/")
async def submit_form(
    full_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    planet_name: Optional[str] = Form(None),
    constellation_name: Optional[str] = Form(None), 
    drawing: UploadFile = File(None)
):
    
    drawing_base64 = None
    if drawing:
        drawing_bytes = await drawing.read()
        drawing_base64 = base64.b64encode(drawing_bytes).decode('utf-8')
    
    form_data = FormData(
        full_name=full_name,
        email=email,
        planet_name=planet_name,
        constellation_name=constellation_name,
        drawing=drawing_base64
    )
    
    collection.insert_one(form_data.dict(exclude_none=True))  

    return JSONResponse(content={"message": "Data stored successfully"}, status_code=201)
