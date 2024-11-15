from json import dumps
from flask import jsonify
from pydantic import BaseModel, Field
from bson import ObjectId
from enum import Enum
import uuid

def gerar_id_unico():
  return str(uuid.uuid4())

class Role(str, Enum):
    barbeiro = "barbeiro"
    cliente = "cliente"


class Item(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    nome: str
    descricao: str
    preco: float

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Usuario(BaseModel):
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    nome: str
    email: str
    senha: str
    role: Role  

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Corte(BaseModel):
    id_unico: str = Field(default_factory=gerar_id_unico)
    nome: str
    dia: str
    hora: str
    servico: str
    descricao: str

