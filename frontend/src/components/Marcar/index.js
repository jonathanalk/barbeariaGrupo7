import React from "react";
import { useState, useEffect, useContext } from "react";
import UserContext from "../AuthContext/usercontext";
import "./marcar.css";
import { v4 as uuidv4 } from 'uuid'; // Importe a função uuidv4


const Marcar = () => {
    const [cortes, setCortes] = useState([]);
    const [newCorte, setNewCorte] = useState({
        nome: "",
        dia: "",
        hora: "",
        servico: "",
        descricao: "",
    });
    const [editingCorte, setEditingCorte] = useState(null);
    const [filter, setFilter] = useState(null);
    const [mostrarJanelaEditar, setMostrarJanelaEditar] = useState(false);
    const [userData] = useContext(UserContext);


    let isBarbeiro = userData.role === "barbeiro";

    const handleFilterChange = (name) => {
        setFilter(name);
    };

    const cortesFiltrados = filter
    ? cortes.filter((corte) => corte.dia === filter)
    : cortes;

  // Função para buscar os cortes do backend
    const fetchCortes = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/cortes/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Inclui o token no header
                        'Content-Type': 'application/json', // Se estiver enviando dados JSON
                    },
                });
                if (!response.ok){
                    throw new Error('Erro ao buscar cortes');
                }    

                const data = await response.json();
                setCortes(data);
            } catch (error) {
                console.error('Erro ao buscar cortes', error);
                
            }    
        } else {
            console.error('Token não encontrado');
        }
        
        
        
    };
    
    useEffect(() => {
        fetchCortes();
      }, [newCorte]);
    
      // Função para lidar com mudanças nos campos de Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCorte((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewCorte((prevState) => ({ ...prevState, [name]: value }));
    };

    // Função para adicionar um novo corte
    const handleAddCorte = async () => {
        const token = localStorage.getItem('token'); // Obtém o token
      
        const idUnico = uuidv4(); 
        try {
          const response = await fetch("http://localhost:5000/cortes/", {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`, // Inclui o token no header
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newCorte, id_unico: idUnico}),
          });
      
          if (!response.ok) {
            const errorData = await response.json(); // Tenta obter a mensagem de erro do servidor
            throw new Error(errorData.message || 'Erro ao adicionar corte');
          }
      
          const data = await response.json();
          setCortes([...cortes, data]);
          setNewCorte({ 
            nome: "", 
            dia: "", 
            hora: "", 
            servico: "", 
            descricao: "" 
          });
        } catch (error) {
          console.error("Erro ao agendar:", error);
          // ... lidar com o erro (ex: exibir mensagem de erro)
        }
    };

    const handleDeleteCorte = async (corte) => { // Recebe o objeto corte completo
        const token = localStorage.getItem('token');
      
        try {
          const response = await fetch(`http://localhost:5000/cortes/`, { // Rota sem ID
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' // Adicione o Content-Type para enviar JSON
            },
            body: JSON.stringify(corte) // Envia o objeto corte no corpo da requisição
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao deletar corte');
          }
      
          // Remove o corte da lista com base nos campos do corte
          setCortes(cortes.filter((c) => 
            c.nome !== corte.nome || 
            c.dia !== corte.dia || 
            c.hora !== corte.hora || 
            c.servico !== corte.servico || 
            c.descricao !== corte.descricao 
          ));
        } catch (error) {
          console.error("Erro ao deletar corte:", error);
          // ... lidar com o erro (ex: exibir mensagem de erro)
        }
    };

    // Função para iniciar a edição de um corte
    const handleEditCorte = (corte) => {
        setMostrarJanelaEditar(!mostrarJanelaEditar);
        setEditingCorte(corte.id_unico); // Armazena o objeto corte completo
        console.log(corte.id_unico);
        
        setNewCorte({
            id_unico: corte.id_unico,
            nome: corte.nome,
            dia: corte.dia,
            hora: corte.hora,
            servico: corte.servico,
            descricao: corte.descricao,
        });
      };
      

      
    // Função para atualizar um corte existente
    const handleUpdateCorte = async (corte) => {
        const token = localStorage.getItem('token');

        console.log(newCorte.id_unico);
        
    
        try {
            await fetch(`http://localhost:5000/cortes/${newCorte.id_unico}`, {  // Inclui o id_unico na URL
              method: "PUT",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({...newCorte, id_unico: newCorte.id_unico})  // Envia apenas os novos dados
            });

            setEditingCorte(null)
        } catch (error) {
        console.error("Erro ao atualizar corte:", error);
        }
        window.location.reload();
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
                                <button onClick={() => handleDeleteCorte(corte)}>Deletar</button>
                                <button onClick={() => handleEditCorte(corte)}>Editar</button>
                                {editingCorte === corte.id_unico && mostrarJanelaEditar &&(
                                <section id={`updatecorte_${corte}`} style={{ marginTop: '20px', display: "flex", flexDirection:"column" }}>
                                    <h3>Atualizar corte</h3>
                                    <label htmlFor="atualizarnome">Nome: </label>
                                        <input 
                                        type="text" 
                                        name="nome"
                                        value={newCorte.nome}
                                        onChange={handleInputChange}
                                        placeholder="Nome do Cliente"
                                        />
                                    <label htmlFor="dias">Dia: </label>
                                        <select id="dias" name="dia" value={newCorte.dia} onChange={handleSelectChange}>
                                            <option>Escolha o dia</option>
                                            <option value="Segunda">Segunda</option>
                                            <option value="Terça">Terça</option>
                                            <option value="Quarta">Quarta</option>
                                            <option value="Quinta">Quinta</option>
                                            <option value="Sexta">Sexta</option>
                                        </select>
                                    <label htmlFor="agendarhoras">Hora: </label>
                                        <select id="agendarhoras" name="hora"value={newCorte.hora} onChange={handleSelectChange}>
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
                                        <select id="atualizarservico" name="servico" value={newCorte.servico} onChange={handleSelectChange}>
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
                                            value={newCorte.descricao}
                                            onChange={handleInputChange}
                                            placeholder="Tem alguma preferência para o corte?"
                                        />
                                    <button onClick={handleUpdateCorte}>Salvar Alterações</button>
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
                        onChange={handleInputChange}
                        placeholder="Tem alguma preferência para o corte?"
                    />
                <button onClick={handleAddCorte}>Adicionar corte</button>
            </section>
        </>
    )
}
export default Marcar;