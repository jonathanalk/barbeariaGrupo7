from enum import Enum

from bson import ObjectId
from pydantic import BaseModel

class Role(str, Enum):
    barbeiro = "barbeiro"
    cliente = "cliente"

class ItemSchema(BaseModel):
    nome: str
    descricao: str
    preco: float

class UsuarioSchema(BaseModel):
    nome: str
    email: str
    senha: str
    role: Role

class CorteSchema(BaseModel):
    id_unico: str
    nome: str
    dia: str
    hora: str
    servico: str
    descricao: str

