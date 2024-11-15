from flask import jsonify
from models import ObjectId, Item, Usuario, Corte
from schemas import ItemSchema, UsuarioSchema, CorteSchema
from database import get_database

# Itens
# ================================================================================================
def get_items():
    database = get_database()
    items = database["items"].find().to_list(1000)
    return [Item(**item) for item in items]

def create_item(item: ItemSchema):
    database = get_database()
    item_dict = item.model_dump()
    result = database["items"].insert_one(item_dict)
    return str(result.inserted_id)

def read_item(item_id: str):
    database = get_database()
    try:
        item = database["items"].find_one({"_id": ObjectId(item_id)})
        if item:
            return Item(**item)
    except Exception as e:
        print(f"Erro ao buscar item: {e}")
    return None

def update_item(item_id: str, item: ItemSchema):
    database = get_database()
    try:
        result = database["items"].update_one(
            {"_id": ObjectId(item_id)}, {"$set": item.model_dump()}
        )
        return result.modified_count
    except Exception as e:
        print(f"Erro ao atualizar item: {e}")
        return 0

def delete_item(item_id: str):
    database = get_database()
    try:
        result = database["items"].delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count
    except Exception as e:
        print(f"Erro ao excluir item: {e}")
        return 0


# Usuarios
# ================================================================================================
def create_usuario(usuario: UsuarioSchema):
    database = get_database()
    usuario_dict = usuario.model_dump()
    result = database["usuarios"].insert_one(usuario_dict)
    created_user = database["usuarios"].find_one({"_id": result.inserted_id})
    return Usuario(**created_user)

def get_usuarios():
    database = get_database()
    usuarios = database["usuarios"].find().to_list(1000)
    return [Usuario(**usuario) for usuario in usuarios]

def get_usuario(usuario_id: str):
    database = get_database()
    try:
        usuario = database["usuarios"].find_one({"_id": ObjectId(usuario_id)})
        if usuario:
            return Usuario(**usuario)
    except Exception as e:
        print(f"Erro ao buscar usuario: {e}")
    return None

def get_email(email: str):
    database = get_database()
    try:
        usuario = database["usuarios"].find_one({"email": email})
        if usuario:
            return True
    except Exception as e:
        print(f"Erro ao buscar usuario por email: {e}")
    return False

def update_usuario(email: str, usuario: UsuarioSchema):
    database = get_database()
    try:
        result = database["usuarios"].update_one(
            {"email": email}, {"$set": usuario.model_dump()}
        )
        return result.modified_count
    except Exception as e:
        print(f"Erro ao atualizar usuario: {e}")
        return 0

def delete_usuario(email: str):
    database = get_database()
    try:
        result = database["usuarios"].delete_one({"email": email})
        return result.deleted_count
    except Exception as e:
        print(f"Erro ao excluir usuario: {e}")
        return 0

def get_user_by_email(email: str):
    database = get_database()
    usuario = database["usuarios"].find_one({"email": email})
    return usuario


# Cortes
# ================================================================================================
def create_corte(corte: CorteSchema):
    database = get_database()
    corte_dict = corte.model_dump()
    result = database["cortes"].insert_one(corte_dict)
    return corte_dict["id_unico"]  # Retorna o id_unico

def get_cortes():
    database = get_database()
    cortes = database["cortes"].find().to_list(1000)
    return [Corte(**corte) for corte in cortes]

def get_corte(id_unico: str):
    database = get_database()
    try:
        corte = database["cortes"].find_one({"id_unico": id_unico})
        if corte:
            return Corte(**corte)
    except Exception as e:
        print(f"Erro ao buscar corte: {e}")
    return None

def get_corte_por_campos(corte: CorteSchema):
    """Busca um corte no banco de dados com base em todos os campos, exceto o _id."""
    database = get_database()
    try:
        # Constrói a query de busca com base nos campos do corte (exceto _id)
        query = {
            "nome": corte.nome,
            "dia": corte.dia,
            "hora": corte.hora,
            "servico": corte.servico,
            "descricao": corte.descricao
        }
        corte_db = database["cortes"].find_one(query)
        if corte_db:
            # Converte o resultado do banco de dados em um objeto Corte
            return Corte(**corte_db)  
    except Exception as e:
        print(f"Erro ao buscar corte: {e}")
    return None

def update_corte(id_unico: str, corte: CorteSchema):
    """Atualiza um corte no banco de dados com base no id_unico."""
    database = get_database()
    try:
        result = database["cortes"].update_one(
            {"id_unico": id_unico}, {"$set": corte.dict()}
        )
        return result.modified_count
    except Exception as e:
        print(f"Erro ao atualizar corte: {e}")
        return 0


def delete_corte(corte: str):
    database = get_database()
    try:
        query = {
            "nome": corte.nome,
            "dia": corte.dia,
            "hora": corte.hora,
            "servico": corte.servico,
            "descricao": corte.descricao
        }
        result = database["cortes"].delete_one(query)
        return result.deleted_count
    except Exception as e:
        print(f"Erro ao excluir corte: {e}")
        return 0