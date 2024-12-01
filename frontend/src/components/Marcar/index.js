import React from "react"
import axios from 'axios';
import { useState, useEffect, useContext} from 'react';
import UserContext from "../AuthContext/usercontext";
import './marcar.css';


    
const Marcar = () => {

    const [cortes, setcortes] = useState([]);
    const [newcorte, setNewcorte] = useState({ nome: '', dia: '', hora: '', servico:'', descricao: ''});
    const [editingcorte, setEditingcorte] = useState(null);
    const [filter, setFilter] = useState(null);
    const [mostrarJanelaEditar, setmostrarJanelaEditar] = useState(false);
    const [userData] = useContext(UserContext)
    
    let isBarbeiro = false;
    
    if (userData.role === "barbeiro") {
      isBarbeiro = true;
    }

    const handleFilterChange = (name) => {
        setFilter(name);
    };

    const cortesFiltrados = filter
    ? cortes.filter(corte => corte.dia === filter)
    : cortes;

    // Função para buscar os cortes do backend
    useEffect(() => {
        axios.get('http://localhost:5000/cortes/')
        .then(response => setcortes(response.data))
        .catch(error => console.error('Erro ao buscar cortes:',
       error));
        }, [newcorte]);
       

    // Função para lidar com mudanças nos campos de Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewcorte(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewcorte(prevState => ({ ...prevState, [name]: value }));
    }

    // Função para adicionar um novo corte
    const handleAddcorte = () => {
        axios.post('http://localhost:5000/cortes/', newcorte)
        .then(response => {
        setcortes([...cortes, { ...newcorte, _id: response.data }]);
        setNewcorte({ nome: '', dia: '', hora: '', servico:'', descricao: '' });
        }).catch(error => console.error('Erro ao agendar:', error));
    };
  
    // Função para deletar um corte
    const handleDeletecorte = (corteId) => {
        axios.delete(`http://localhost:5000/cortes/${corteId}`)
        .then(response => {setcortes(cortes.filter(corte => corte._id !== corteId))})
        .catch(error => console.error('Erro ao deletar corte:', error));
    };
  
    // Função para iniciar a edição de um corte
    const handleEditcorte = (corte) => {
        setmostrarJanelaEditar(!mostrarJanelaEditar);
        setEditingcorte(corte._id);
        setNewcorte({ nome: corte.nome, dia: corte.dia, hora: corte.hora, servico: corte.servico, descricao: corte.descricao });
    };
  
    // Função para atualizar um corte existente
    const handleUpdatecorte = () => {
        axios.put(`http://localhost:5000/cortes/${editingcorte}`, newcorte)
        .then(response => {
        setcortes(cortes.map(corte => (
        corte._id === editingcorte ? { ...corte, ...newcorte } : corte )));
        setEditingcorte(null);
        setNewcorte({ nome: '', dia: '', hora: '', servico:'', descricao: '' }); 
        }).catch(error => console.error('Erro ao atualizar corte:', error));
    };

    
    return(
        <>
        <h2>CORTES AGENDADOS</h2>
        <section className="agenda" id="editar">
                    {cortes.length === 0 ? (
                    <p>Nenhum corte foi agendado ainda.</p>
                    ) : (<div>
                            <section id="filtros">
                                <button onClick={() => handleFilterChange('')}>Todos</button>
                                <button onClick={() => handleFilterChange('Segunda')}>Segunda</button>
                                <button onClick={() => handleFilterChange('Terça')}>Terça</button>
                                <button onClick={() => handleFilterChange('Quarta')}>Quarta</button>
                                <button onClick={() => handleFilterChange('Quinta')}>Quinta</button>
                                <button onClick={() => handleFilterChange('Sexta')}>Sexta</button>
                            </section>
                            <ul> 
                            {cortesFiltrados.map((corte, index) => (
                            <li id="listacorte" key={index}>
                                <p><strong>{index + 1}. Nome: </strong>{corte.nome}</p>
                                <p><strong>Dia: </strong>{corte.dia}</p> 
                                <p><strong>Hora: </strong>{corte.hora}</p> 
                                <p><strong>Serviço: </strong>{corte.servico}</p> 
                                <strong>Descrição</strong> {corte.descricao}
                                {isBarbeiro ? (<div>
                                <button onClick={() => handleDeletecorte(corte._id)}>Deletar</button>
                                <button onClick={() => handleEditcorte(corte)}>Editar</button>
                                {editingcorte === corte._id && mostrarJanelaEditar &&(
                                <section id={`updatecorte_${corte._id}`} style={{ marginTop: '20px', display: "flex", flexDirection:"column" }}>
                                    <h3>Atualizar corte</h3>
                                    <label htmlFor="atualizarnome">Nome: </label>
                                        <input type="text" name="nome"
                                        onChange={handleInputChange}
                                        placeholder="Nome do Cliente"
                                        />
                                    <label htmlFor="dias">Dia: </label>
                                        <select id="dias" name="diaat" onChange={handleSelectChange}>
                                            <option>Escolha o dia</option>
                                            <option value="Segunda">Segunda</option>
                                            <option value="Terça">Terça</option>
                                            <option value="Quarta">Quarta</option>
                                            <option value="Quinta">Quinta</option>
                                            <option value="Sexta">Sexta</option>
                                        </select>
                                    <label htmlFor="agendarhoras">Hora: </label>
                                        <select id="agendarhoras" name="horaat" onChange={handleSelectChange}>
                                            <optgroup label="Manhã">
                                                <option>Escolha o horário</option>
                                                <option value="08:30">08:30</option>
                                                <option value="09:00">09:00</option>
                                                <option value="09:30">09:30</option>
                                                <option value="10:00">10:00</option>
                                                <option value="10:30">10:30</option>
                                                <option value="11:00">11:00</option>
                                                <option value="11:30">11:30</option>
                                                <option value="12:00">12:00</option>
                                            </optgroup>
                                            <optgroup label="Tarde">
                                                <option value="12:30">12:30</option>
                                                <option value="13:00">13:00</option>
                                                <option value="13:30">13:30</option>
                                                <option value="14:00">14:00</option>
                                                <option value="14:30">14:30</option>
                                                <option value="15:00">15:00</option>
                                                <option value="15:30">15:30</option>
                                                <option value="16:00">16:00</option>
                                            </optgroup>
                                        </select>
                                    <label htmlFor="atualizarservico">Serviço: </label>
                                        <select id="atualizarservico" name="servicoat" onChange={handleSelectChange}>
                                            <option>Escolha o serviço</option>
                                            <option value="Máquina">Máquina</option>
                                            <option value="Tesoura">Tesoura</option>
                                            <option value="Infantil">Infantil</option>
                                            <option value="Barba">Barba</option>
                                            <option value="Bigode">Bigode</option>
                                            <option value="Barba e bigode">Barba e bigode</option>
                                            <option value="Completo">Completo</option>
                                        </select>
                                    <label htmlFor="atualizardescricao" style={{marginBottom:"0.2rem"}}>Descrição do corte: </label>
                                        <input id="atualizardescricao"
                                            type="text" name="descricao"
                                            onChange={handleInputChange}
                                            placeholder="Tem alguma preferência para o corte?"
                                        />
                                    <button onClick={handleUpdatecorte}>Salvar Alterações</button>
                                </section>
                                )}
                                </div>) : (
                                    <p></p>
                                )}
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
            </section>
            <section className="agenda" id="novocorte">
                <h2>Agendar corte</h2>
                <label htmlFor="agendarnome">Nome: </label>
                    <input id="agendarnome"
                    type="text" name="nome"
                    value={newcorte.nome}
                    onChange={handleInputChange}
                    placeholder="Nome do Cliente"
                    required
                    />
                <label htmlFor="agendardias">Dia:</label>
                    <select id="agendardias" name="dia" onChange={handleSelectChange} required>
                        <option>Escolha o dia</option>
                        <option value="Segunda">Segunda</option>
                        <option value="Terça">Terça</option>
                        <option value="Quarta">Quarta</option>
                        <option value="Quinta">Quinta</option>
                        <option value="Sexta">Sexta</option>
                    </select>
                <label htmlFor="agendarhoras">Hora: </label>
                    <select id="agendarhoras" name="hora" onChange={handleSelectChange} required>
                        <optgroup label="Manhã">
                            <option>Escolha o horário</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                        </optgroup>
                        <optgroup label="Tarde">
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                        </optgroup>
                    </select>
                <label htmlFor="agendarservico">Serviço: </label>
                    <select id="agendarservico" name="servico" onChange={handleSelectChange} required>
                        <option>Escolha o serviço</option>
                        <option value="Máquina">Máquina</option>
                        <option value="Tesoura">Tesoura</option>
                        <option value="Infantil">Infantil</option>
                        <option value="Barba">Barba</option>
                        <option value="Bigode">Bigode</option>
                        <option value="Barba e bigode">Barba e bigode</option>
                        <option value="Completo">Completo</option>
                    </select>
                <label htmlFor="agendardescricao" style={{marginBottom:"0.2rem"}}>Descrição do corte: </label>
                    <input id="agendardescricao" 
                        type="text" name="descricao"
                        value={newcorte.descricao}
                        onChange={handleInputChange}
                        placeholder="Tem alguma preferência para o corte?"
                    />
                <button onClick={handleAddcorte}>Adicionar corte</button>
            </section>
        </>
    )
}
export default Marcar;