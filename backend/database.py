from pymongo import MongoClient

# Conexão com o MongoDB
MONGO_URI = "mongodb://mongodb:27017/"  # Ou seu endereço do MongoDB Atlas
DATABASE_NAME = "barbearia"  # Nome do seu banco de dados

def get_database():
    """
    Retorna uma instância do banco de dados MongoDB.
    """
    client = MongoClient(MONGO_URI)
    database = client[DATABASE_NAME]
    return database