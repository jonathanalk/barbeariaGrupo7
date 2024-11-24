import './styles/App.css';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Slogan from './components/Slogan';
import About from './components/About';
import Servicos from './components/Servicos';
import Agendar from './components/Agendar';
import Contato from './components/Contato';
import Maps from './components/Maps';
import Footer from './components/Footer';
import Marcar from './components/Marcar';
import Barbeiro from './components/Barbeiro';
import Signup from './components/Signup';
import Context from './components/AuthContext/context';
import UserContext from './components/AuthContext/usercontext';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [isLoginIn, setIsLoginIn] = useState(false);
  const [mostrarJanelaAgendar, setmostrarJanelaAgendar] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleClick = () => {
    setmostrarJanelaAgendar(!mostrarJanelaAgendar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    try {
      const response = await fetch('http://localhost:5000/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
 username: email, password: senha }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setUserData(data);
      setIsLoginIn(true);
      console.log('Login bem-sucedido!');
    } catch (error) {
      setErro('Credenciais inválidas.');
      console.error('Erro no login:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setmostrarJanelaAgendar(false);
    setIsLoginIn(false);
    setUserData(null); // Limpa os dados do usuário ao deslogar
    console.log('Logout efetuado!');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      // console.log("Token:", token);

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/me/',
 {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();

          setUserData(data);
          setIsLoginIn(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          handleLogout(); // Desloga o usuário em caso de erro
        }
      }
    };

    fetchUserData();
  }, [isLoginIn]);

  return (
    <Context.Provider value={[isLoginIn, setIsLoginIn]}>
      <UserContext.Provider value={[userData, setUserData]}>
      <div>
      <section id='login'>
        {isLoginIn ? (
          <div>
            <h2>Você está logado!</h2>
              <h2>Dados do Usuário:</h2>
              <p>Nome: {userData.nome}</p>
              <p>Email: {userData.email}</p>
            <button onClick={handleLogout}>Deslogar</button>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            {erro && <div className="erro">{erro}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="exemplo@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  placeholder="Coloque sua senha"
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="password"
                />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </section> 
      {!isLoginIn && (
      <Signup />)}
      {userData && userData.role === "barbeiro" ? (
        <Barbeiro />
      ) : (
        <> 
          <Header />
          <Slogan />
          <About />
          <Servicos />
          <Agendar onClick={handleClick} />
            {mostrarJanelaAgendar && <Marcar />}
          <Contato />
          <Maps />
          <Footer />
        </>
      )}
    </div>
    </UserContext.Provider>
  </Context.Provider>
  )
};


export default App;


