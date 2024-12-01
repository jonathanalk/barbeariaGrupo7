import { useState } from 'react'; 
import axios from 'axios';
import './signup.css';

const Signup = () => {
    const [newUser, setNewUser] = useState({ nome: '', email: '', senha: ''});
    const [isCadastrado, setIsCadastrado] = useState(false);

    // Função para adicionar um novo usuario
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:5000/Signup', newUser) 
          .then(response => {
            setIsCadastrado(true)
          })
          .catch(error => {
            console.error(error);
            alert("Ocorreu um erro ao se cadastrar.")
          });
    };
      
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({...prev,   [name]: value}));
    };

    return (
        <section id="cadastrar">
            {isCadastrado ? (
        <div>
          <h2>Você se cadastrou!</h2>
            <p>Faça o Login.</p>
        </div>
      ) : (<div>
            <h2>Cadastre-se!</h2>
            <form onSubmit={handleSubmitEvent}>
                <label htmlFor='newuser-nome'>Nome: </label>
                <input type="text"
                    id="newuser-nome"
                    name="nome"
                    value={newUser.nome}
                    placeholder="Coloque seu nome"
                    onChange={handleInputChange}
                    required
                    autoComplete='nome'
                />
                <label htmlFor='newuser-email'>Email: </label>
                <input type="email"
                    id="newuser-email"
                    name="email"
                    value={newUser.email}
                    placeholder="exemplo@gmail.com"
                    onChange={handleInputChange}
                    required
                    autoComplete='email'
                />
                <label htmlFor='newuser-senha'>Senha: </label>
                <input type="password"
                    id="newuser-senha"
                    name="senha"
                    value={newUser.senha}
                    placeholder="Crie sua senha"
                    onChange={handleInputChange}
                    required
                    autoComplete='senha'
                />
                <button type="submit" style={{marginLeft:"5px"}}>Cadastrar</button>
            </form>
            </div>)}
       </section>
    );
};

export default Signup;