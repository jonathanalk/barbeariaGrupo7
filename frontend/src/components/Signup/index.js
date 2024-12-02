import { useState } from 'react';
import './signup.css';

const Signup = () => {
  const [newUser, setNewUser] = useState({ nome: '', email: '', senha: '' });
  const [isCadastrado, setIsCadastrado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/Signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(alert(errorData.message || "Ocorreu um erro ao se cadastrar."));
      } else {
        setIsCadastrado(true);
        alert('Usuário cadastrado com sucesso!');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="cadastrar">
      {isCadastrado ? (
        <div>
          <h2>Você se cadastrou!</h2>
          <p>Faça o Login.</p>
        </div>
      ) : (
        <div>
          <h2>Cadastre-se!</h2>
          <form onSubmit={handleSubmitEvent}>
            <label htmlFor='newuser-nome'>Nome:</label>
            <input
              type="text"
              id="newuser-nome"
              name="nome"
              value={newUser.nome}
              placeholder="Coloque seu nome"
              onChange={handleInputChange}
              required
              autoComplete='nome'
            />
            <label htmlFor='newuser-email'>Email:</label>
            <input
              type="email"
              id="newuser-email"
              name="email"
              value={newUser.email}
              placeholder="exemplo@gmail.com"
              onChange={handleInputChange}
              required
              autoComplete='email'
            />
            <label htmlFor='newuser-senha'>Senha:</label>
            <input
              type="password"
              id="newuser-senha"
              name="senha"
              value={newUser.senha}
              placeholder="Crie sua senha"
              onChange={handleInputChange}
              required
              autoComplete='senha'
            />
            <button type="submit" style={{ marginLeft: "5px" }}>Cadastrar</button>
          </form>
        </div>
      )}
      {isLoading && <p>Carregando...</p>}
      {error && <div className="error">{error}</div>}
    </section>
  );
};

export default Signup;