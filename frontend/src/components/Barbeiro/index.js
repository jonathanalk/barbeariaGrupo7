import React from "react";
import { useState, useEffect } from "react";
import "./barbeiro.css";
import Marcar from "../Marcar";

const Barbeiro = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "",
  });
  const [editingusuario, setEditingUsuario] = useState(null);
  const [mostrarJanelaEditar, setmostrarJanelaEditar] = useState(false);

  // Função para buscar os usuarios do backend
  useEffect(() => {
    const fetchUsuarios = async () => {  // Função assíncrona para usar async/await
      const token = localStorage.getItem('token');  // Obtém o token

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/usuarios/", {
            headers: {
              'Authorization': `Bearer ${token}`,  // Inclui o token no header
            },
          });

          if (!response.ok) {
            throw new Error("Erro ao buscar usuarios");
          }

          const data = await response.json();
          setUsuarios(data);
        } catch (error) {
          console.error("Erro ao buscar usuarios:", error);
          // ... lidar com o erro (ex: exibir mensagem de erro)
        }
      } else {
        console.error('Token não encontrado');
        // ... lidar com a falta do token (ex: redirecionar para a página de login)
      }
    };

  fetchUsuarios();  // Chama a função para buscar os usuários
}, [newUsuario]);

  // Função para lidar com mudanças nos campos de Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  // Função para adicionar um novo usuario
  const handleAddUsuario = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/Signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUsuario),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(alert("Erro ao adicionar usuário"));
        }
        // Atualiza a lista de usuários após adicionar um novo
        return response.json(); 
      })
      .then(data => {
        setUsuarios([...usuarios, data]); // Adiciona o novo usuário à lista
        alert("Novo usuário cadastrado")
        setNewUsuario({ nome: "", email: "", senha: "", role: "" }); // Limpa o formulário
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Função para deletar um usuario
  const handleDeleteUsuario = async (usuarioEmail) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${usuarioEmail}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,  // Inclui o token no header
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Tenta obter a mensagem de erro do servidor
        throw new Error(alert(errorData.message || 'Erro ao deletar usuário'));
      }
  
      setUsuarios(usuarios.filter((usuario) => usuario.email !== usuarioEmail));
      alert("Usuário deletado")
    } catch (error) {
      console.error("Erro ao deletar usuario:", error);
      // ... lidar com o erro (ex: exibir mensagem de erro)
    }
  };

  // Função para iniciar a edição de um usuario
  const handleEditUsuario = (usuario) => {
    setmostrarJanelaEditar(!mostrarJanelaEditar);
    setEditingUsuario(usuario.email);
    setNewUsuario({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      role: usuario.role,
    });
  };

  // Função para atualizar um usuario existente
  const handleUpdateUsuario = async () => {
    const token = localStorage.getItem('token');
  
    try {
      // Inclui o email no corpo da requisição
      const usuarioAtualizado = { 
        email: editingusuario, // Inclui o email aqui
        ...newUsuario 
      };
      
      const response = await fetch(`http://localhost:5000/usuarios/${editingusuario}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioAtualizado), // Envia os dados com o _id
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(alert(errorData.message || 'Erro ao atualizar usuário'));
      }
  
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.email === editingusuario ? { ...usuario, ...newUsuario } : usuario,
        ),
      );
      setEditingUsuario(null);
      setNewUsuario({ nome: "", email: "", senha: "", role: "" });
      alert("Usuário atualizado")
  
    } catch (error) {
      console.error("Erro ao atualizar usuario:", error);
      // ... lidar com o erro (ex: exibir mensagem de erro)
    }
  };


  return (
    <div id="barbeiro">
      <Marcar />
      <>
        <h2>Usuarios cadastrados</h2>
        <section className="agenda" id="editar">
          {usuarios.length === 0 ? (
            <p>Nenhum usuario foi agendado ainda.</p>
          ) : (
            <ul>
              {usuarios.map((usuario, index) => (
                <li id="listausuario" key={index}>
                  <p>
                    <strong>{index + 1}. Nome: </strong>
                    {usuario.nome}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {usuario.email}
                  </p>
                  <p>
                    <strong>Tipo: </strong>
                    {usuario.role}
                  </p>
                  <button onClick={() => handleDeleteUsuario(usuario.email)}>
                    Deletar
                  </button>
                  <button onClick={() => handleEditUsuario(usuario)}>
                    Editar
                  </button>
                  {editingusuario === usuario.email && mostrarJanelaEditar && (
                    <section
                      id={`updateusuario_${usuario.email}`}
                      style={{ margin: "20px" }}
                    >
                      <h3>Atualizar usuario</h3>
                      <label htmlFor="atualizarnome">Nome:</label>
                      <input
                        type="text"
                        name="nome"
                        value={newUsuario.nome}
                        onChange={handleInputChange}
                        placeholder="Nome do Cliente"
                      />
                      <br></br>
                      <label htmlFor="atualizaremail" style={{ marginBottom: "0.2rem" }}>
                        Email do cliente:
                      </label>
                      <input
                        id="atualizardescricao"
                        type="text"
                        name="email"
                        value={newUsuario.email}
                        onChange={handleInputChange}
                        placeholder="example@example.com"
                      />
                      <label htmlFor="role">Tipo do usuário:</label>
                      <select
                        id="role"
                        name="role"
                        onChange={handleSelectChange}
                      >
                        <option>Coloque o tipo de usuário</option>
                        <option value="cliente">Cliente</option>
                        <option value="barbeiro">Barbeiro</option>
                      </select>
                      <button onClick={handleUpdateUsuario}>
                        Salvar Alterações
                      </button>
                    </section>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="agenda" id="novousuario">
          <h2>Cadastrar usuario</h2>
          <form onSubmit={handleAddUsuario} id="formcorte">
            <label htmlFor="cadastrarnome">Nome:</label>
            <input
              id="cadastrarnome"
              type="text"
              name="nome"
              onChange={handleInputChange}
              placeholder="Nome do Cliente"
              required
            />
            <label htmlFor="cadastraremail" style={{ marginBottom: "0.2rem" }}>
              Email do usuario:
            </label>
            <input
              id="cadastraremail"
              type="text"
              name="email"
              onChange={handleInputChange}
              placeholder="example@example.com"
              required
            />
            <label htmlFor="cadastrarsenha" style={{ marginBottom: "0.2rem" }}>
              Senha do usuario:
            </label>
            <input
              id="cadastrarsenha"
              type="password"
              name="senha"
              onChange={handleInputChange}
              placeholder="senha"
              required
            />
            <label htmlFor="role">Tipo do usuário:</label>
            <select id="role" name="role" onChange={handleSelectChange}>
              <option>Coloque o tipo de usuário</option>
              <option value="cliente">Cliente</option>
              <option value="barbeiro">Barbeiro</option>
            </select>
            <button type="submit">Adicionar usuario</button>
          </form>
        </section>
      </>
    </div>
  );
};

export default Barbeiro;