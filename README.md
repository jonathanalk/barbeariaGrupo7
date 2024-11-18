Barbearia: Xande (Agendamento Online)
Este projeto consiste em uma aplicação web para agendamento de serviços de barbearia, com frontend em ReactJS e backend em Flask com MongoDB.


Funcionalidades
Agendamento de Cortes: Clientes podem agendar cortes online, escolhendo dia, hora, serviço e descrição.
Gerenciamento de Cortes: Barbeiros podem visualizar, adicionar, editar e excluir agendamentos.
Autenticação: Usuários (clientes e barbeiros) podem se cadastrar e fazer login.
Gerenciamento de Usuários: Administradores podem gerenciar os usuários cadastrados.


Tecnologias Utilizadas
Frontend: ReactJS
Backend: Flask (Python)
Banco de Dados: MongoDB
Containerização: Docker


Pré-requisitos
Docker
Docker Compose


Como executar o projeto
1.Clone o repositório:
Bash
git clone https://github.com/seu-usuario/barbearia.git

2.Acesse o diretório do projeto:
Bash
cd barbearia
Use o código com cuidado.

3.Crie e inicie os containers:
Bash
docker-compose up -d
Use o código com cuidado.

4.Acesse a aplicação:
Abra seu navegador e acesse http://localhost:3000.


Estrutura do projeto
barbearia/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── ...
├── backend/
│   ├── app.py
│   ├── crud.py
│   ├── models.py
│   ├── schemas.py
│   └── ...
├── docker-compose.yml
└── Dockerfile

5.Usuarios Padrão:
Usuarios:                Senha:
admin@example.com           admin

cliente@example.com          cliente

Endpoints da API
/token/ (POST): Obtém um token de acesso JWT para autenticação.
/Signup/ (POST): Cadastra um novo usuário.
/me/ (GET): Retorna os dados do usuário logado.
/usuarios/ (GET, POST): Lista/cria usuários (requer autenticação).
/usuarios/<email> (GET, PUT, DELETE): Atualiza/exclui um usuário por email (requer autenticação).
/cortes/ (GET, POST): Lista/cria cortes (requer autenticação).
/items/ (GET, POST): Lista/cria items (requer autenticação).


Próximos passos
Implementar CRUD com flask suportando ObjectId
    <!-- /usuarios/<usuario_id> (GET, PUT, DELETE): Lê/atualiza/exclui um usuário (requer autenticação). -->
    <!-- /cortes/<corte_id> (GET, PUT, DELETE): Lê/atualiza/exclui um corte (requer autenticação). -->
    <!-- /items/<item_id> (GET, PUT, DELETE): Lê/atualiza/exclui um item (requer autenticação). -->
Implementar testes unitários e de integração.
Adicionar recursos de segurança, como validação de entrada e proteção contra ataques CSRF.
Melhorar a interface do usuário e a experiência do usuário (UI/UX).
Implementar a funcionalidade de pagamento online.
Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

Autor
GRUPO 7
    -Alex Sander Pereira da Silva Junior
    -Francisco Gustavo de Jesus da Silva
    -Jean Vieira Silva
    -Jonathan Alves de Souza
    -Lucas da Silva Sleman
    -Yann Guimarães de Oliveira Araújo

Licença
MIT License