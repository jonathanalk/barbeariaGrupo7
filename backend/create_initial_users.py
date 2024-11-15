from crud import create_usuario, get_usuarios
from schemas import UsuarioSchema
from models import Usuario
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_initial_users():
    """
    Cria as contas de admin e cliente se não existirem usuários no banco de dados.
    """

    # Verifica se já existem usuários no banco de dados
    usuarios = get_usuarios()  # Importe a função get_usuarios do seu crud.py
    if (usuarios):
        print("Já existem usuários no banco de dados. Contas iniciais não foram criadas.")
        return
    else:
        # Cria a conta de admin
        admin = Usuario(
            nome = "Admin",
            email = "admin@example.com",
            senha = pwd_context.hash("admin"),  # Criptografa a senha
            role = "barbeiro"
        )
        create_usuario(admin)
        print("Conta de admin criada com sucesso!")

        # Cria a conta de cliente
        cliente = Usuario(
            nome = "Cliente",
            email = "cliente@example.com",
            senha = pwd_context.hash("cliente"),  # Criptografa a senha
            role = "cliente"
        )
        create_usuario(cliente)
        print("Conta de cliente criada com sucesso!")
    