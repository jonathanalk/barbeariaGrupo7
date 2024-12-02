# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from marshmallow import ValidationError
from functools import wraps
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

from models import Usuario
from schemas import CorteSchema, UsuarioSchema
from create_initial_users import create_initial_users
from crud import (
    delete_corte, delete_usuario,
    get_corte, get_cortes, get_user_by_email, get_email,
    create_usuario, create_corte, get_usuario, get_usuarios,
    update_corte, update_usuario,
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuração de segurança
SECRET_KEY = "u9Y0LVKQqkEvjAL7I5_kVYifBQIgH_CumJUxNE6jjcs"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funções auxiliares
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Decorador para proteger rotas
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"message": "Token ausente"}), 401
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if email is None:
                return jsonify({"message": "Token inválido"}), 401
            current_user = get_user_by_email(email)
            if current_user is None:
                return jsonify({"message": "Usuário não encontrado"}), 404
        except JWTError:
            return jsonify({"message": "Token inválido"}), 401

        return f(Usuario(**current_user), *args, **kwargs)  # Passar o objeto Usuario
    return decorated

@app.route("/", methods=["GET"])
def main():
    print("hello")
    return jsonify({"message":"Hello World"})

# Rota de login
@app.route("/token/", methods=["POST"])
def login_for_access_token():
    try:
        data = request.get_json()
        email = data.get("username")
        password = data.get("password")
        if not email or not password:
            return jsonify({"message": "Email e senha são obrigatórios"}), 400

        user = get_user_by_email(email)
        # print(user['senha'])
        if not user or not verify_password(password, user['senha']):
            return jsonify({"message": "Email ou senha inválidos"}), 401

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        return jsonify({"access_token": access_token, "token_type": "bearer"})

    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

# Rota de cadastro
@app.route("/Signup/", methods=["POST"])
def create_usuario_signup():
    try:
        data = request.get_json()

        # Define o valor padrão para 'role'
        data['role'] = data.get('role', 'cliente')

        existing_user = get_email(data['email'])
        if existing_user:
            return jsonify({"message": "Email já cadastrado"}), 400

        hashed_password = get_password_hash(data['senha'])
        new_user = Usuario(
            nome=data['nome'],
            email=data['email'],
            senha=hashed_password,
            role=data['role']
        )
        create_user = create_usuario(new_user)
        # return jsonify(create_user.model_dump()), 201
        return jsonify({"message": "hello"}), 201

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

# Usuarios
# ================================================================================================
@app.route("/usuarios/", methods=["POST"])
@token_required 
def create_usuario_route(current_user):
    try:
        data = request.get_json()
        usuario = UsuarioSchema().load(data)

        existing_user = get_email(usuario['email'])
        if existing_user:
            return jsonify({"message": "Email já cadastrado"}), 400
        if existing_user == "":
            return jsonify({"message": "Campo de Email Vazio"}), 400

        hashed_password = get_password_hash(usuario['senha'])
        new_user = Usuario(
            nome=usuario['nome'],
            email=usuario['email'],
            senha=hashed_password,
            role=usuario['role']
        )
        create_user = create_usuario(new_user)

        return jsonify(create_user.model_dump()), 201

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/usuarios/", methods=["GET"])
@token_required
def get_usuarios_route(current_user):
    try:
        usuarios = get_usuarios()
        return jsonify([usuario.model_dump() for usuario in usuarios])
    except Exception as e:
        print(f"Erro ao buscar usuários: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/usuarios/<usuario_id>", methods=["GET"])
@token_required
def get_usuario_route(current_user, usuario_id: str):
    try:
        usuario = get_usuario(usuario_id)
        if usuario:
            return jsonify(usuario.model_dump())
        return jsonify({"message": "Usuário não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/usuarios/<email>", methods=["PUT"])
@token_required
def update_usuario_route(current_user, email: str):
    print(email)
    try:
        data = request.get_json()
        print(data['nome'])
        usuario = UsuarioSchema(**data)  # Validação com Marshmallow
        modified_count = update_usuario(email, usuario)
        if modified_count:
            return jsonify({"message": "Atulizado com sucesso!"}), 200
        return jsonify({"message": "Usuário não encontrado"}), 404
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        print(f"Erro ao atualizar usuário: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/usuarios/<email>", methods=["DELETE"])
@token_required
def delete_usuario_por_email_route(current_user, email: str):
    try:
        deleted_count = delete_usuario(email)
        if deleted_count:
            return jsonify({"message": "Usuário excluído com sucesso"})
        return jsonify({"message": "Usuário não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao excluir usuário: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/me/", methods=["GET"])
@token_required
def read_users_me(current_user: Usuario):  # current_user injetado pelo decorador
    return jsonify(current_user.model_dump())

# Cortes
# ================================================================================================
@app.route("/cortes/", methods=["POST"])
@token_required
def create_corte_route(current_user):
    try:
        data = request.get_json()
        # Validação com Marshmallow ou Pydantic (dependendo da sua escolha)
        corte = CorteSchema(**data)
        corte_id = create_corte(corte)
        return jsonify({"_id": str(corte_id), **corte.model_dump()}), 201

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        print(f"Erro ao criar corte: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/cortes/", methods=["GET"])
@token_required
def read_cortes_route(current_user):
    try:
        cortes = get_cortes()
        return jsonify([corte.model_dump() for corte in cortes])
    except Exception as e:
        print(f"Erro ao buscar cortes: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/cortes/<corte_id>", methods=["GET"])
@token_required
def read_corte_route(current_user, corte_id: str):
    try:
        corte = get_corte(corte_id)
        if corte:
            return jsonify(corte.model_dump())
        return jsonify({"message": "Corte não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao buscar corte: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/cortes/<id_unico>", methods=["PUT"])  # Inclui o id_unico na rota
@token_required
def update_corte_route(current_user, id_unico: str):
    try:
        data = request.get_json()
        corte = CorteSchema(**data)

        modified_count = update_corte(id_unico, corte)  # Função update_corte modificada no crud.py
        if modified_count:
            return jsonify({"message": "Corte atualizado com sucesso"})
        return jsonify({"message": "Corte não encontrado"}), 404
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        print(f"Erro ao atualizar corte: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500

@app.route("/cortes/", methods=["DELETE"])
@token_required
def delete_corte_route(current_user):
    try:
        data = request.get_json()
        corte = CorteSchema(**data)
        deleted_count = delete_corte(corte)
        if deleted_count:
            return jsonify({"message": "Corte excluído com sucesso"})
        return jsonify({"message": "Corte não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao excluir corte: {e}")
        return jsonify({"message": "Erro ao processar a requisição"}), 500


if __name__ == "__main__":
    create_initial_users()
    app.run(host='0.0.0.0',port=5000,debug=True)