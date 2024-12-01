import React from "react"
import axios from 'axios';
import { useState, useEffect } from 'react';
import './barbeiro.css';
import Marcar from "../Marcar";


const Barbeiro = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [newUsuario, setNewUsuario] = useState({ nome: '', email: '', senha: '', role:''});
    const [editingusuario, setEditingUsuario] = useState(null);
    const [mostrarJanelaEditar, setmostrarJanelaEditar] = useState(false);


    
    // Função para buscar os usuarios do backend
    useEffect(() => {
        axios.get('http://localhost:5000/usuarios/')
        .then(response => setUsuarios(response.data))
        .catch(error => console.error('Erro ao buscar usuarios:',
       error));
        }, [newUsuario]);
       

    // Função para lidar com mudanças nos campos de Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario(prevState => ({ ...prevState, [name]: value }));
    }

    // Função para adicionar um novo usuario
    const handleAddUsuario = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:5000/Signup', newUsuario) 
          .then(response => {
          })
          .catch(error => {
            console.error(error);
          });
    };
  
    // Função para deletar um usuario
    const handleDeleteUsuario = (usuarioId) => {
        axios.delete(`http://localhost:5000/usuarios/${usuarioId}`)
        .then(response => {setUsuarios(usuarios.filter(usuario => usuario._id !== usuarioId))})
        .catch(error => console.error('Erro ao deletar usuario:', error));
    };
  
    // Função para iniciar a edição de um usuario
    const handleEditUsuario = (usuario) => {
        setmostrarJanelaEditar(!mostrarJanelaEditar);
        setEditingUsuario(usuario._id);
        setNewUsuario({ nome: usuario.nome, email: usuario.email, senha: usuario.senha, role: usuario.role});
    };
  
    // Função para atualizar um usuario existente
    const handleUpdateUsuario = () => {
        axios.put(`http://localhost:5000/usuarios/${editingusuario}`, newUsuario)
        .then(response => {
        setUsuarios(usuarios.map(usuario => (
        usuario._id === editingusuario ? { ...usuario, ...newUsuario } : usuario )));
        setEditingUsuario(null);
        setNewUsuario({ nome: '', email: '', senha: '', role:''}); 
        }).catch(error => console.error('Erro ao atualizar usuario:', error));
    };

    return (
        <div id="barbeiro">
            <Marcar/>
            <>
            <h2>Usuarios cadastrados</h2>
            <section className="agenda" id="editar">
                    {usuarios.length === 0 ? (
                    <p>Nenhum usuario foi agendado ainda.</p>
                    ) : (
                    <ul>
                        {usuarios.map((usuario, index) => (
                        <li id="listausuario" key={index}>
                            <p><strong>{index + 1}. Nome: </strong>{usuario.nome}</p>
                            <p><strong>Email: </strong>{usuario.email}</p> 
                            <p><strong>Tipo: </strong>{usuario.role}</p> 
                            <button onClick={() => handleDeleteUsuario(usuario._id)}>Deletar</button>
                            <button onClick={() => handleEditUsuario(usuario)}>Editar</button>
                            {editingusuario === usuario._id && mostrarJanelaEditar &&(
                            <section id={`updateusuario_${usuario._id}`} style={{ margin: '20px' }}>
                                <h3>Atualizar usuario</h3>
                                <label htmlFor="atualizarnome">Nome: </label>
                                    <input type="text" name="nome"
                                        value={newUsuario.nome}
                                        onChange={handleInputChange}
                                        placeholder="Nome do Cliente"
                                    />
                                <label htmlFor="atualizaremail" style={{marginBottom:"0.2rem"}}>Email do cliente: </label>
                                    <input id="atualizardescricao"
                                        type="text" name="email"
                                        value={newUsuario.email}
                                        onChange={handleInputChange}
                                        placeholder="example@example.com"
                                    />   
                                <label htmlFor="role">Tipo do usuário: </label>
                                    <select id="role" name="roleat" onChange={handleSelectChange}>
                                        <option>Coloque o tipo de usuário</option>
                                        <option value="cliente">Cliente</option>
                                        <option value="barbeiro">Barbeiro</option>
                                    </select>
                                <button onClick={handleUpdateUsuario}>Salvar Alterações</button>
                            </section>
                            )}
                        </li>
                    ))}
                    </ul>
                    )}
            </section>
            <section className="agenda" id="novousuario">
                <h2>Cadastrar usuario</h2>
                <label htmlFor="cadastrarnome">Nome: </label>
                    <input id="cadastrarnome"
                        type="text" name="nome"
                        value={newUsuario.nome}
                        onChange={handleInputChange}
                        placeholder="Nome do Cliente"
                        required
                    />
                <label htmlFor="cadastraremail" style={{marginBottom:"0.2rem"}}>Email do usuario: </label>
                    <input id="cadastraremail" 
                        type="text" name="email"
                        value={newUsuario.email}
                        onChange={handleInputChange}
                        placeholder="example@example.com"
                        required
                    />
                <label htmlFor="cadastrarsenha" style={{marginBottom:"0.2rem"}}>Senha do usuario: </label>
                    <input id="cadastrarsenha" 
                        type="password" name="senha"
                        value={newUsuario.senha}
                        onChange={handleInputChange}
                        placeholder="senha"
                        required
                    />
                <label htmlFor="role">Tipo do usuário: </label>
                    <select id="role" name="role" onChange={handleSelectChange}>
                        <option>Coloque o tipo de usuário</option>
                        <option value="cliente">Cliente</option>
                        <option value="barbeiro">Barbeiro</option>
                    </select>    
                <button onClick={handleAddUsuario}>Adicionar usuario</button>
            </section>
        </>
        </div>
    )
}
export default Barbeiro;