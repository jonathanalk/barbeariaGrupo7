import React from 'react'; 
import './header.css';


const Header = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        };

    return (
        <header>
            <nav>
               <div id="DivLogo">
                    <a href="index.html">
                    <img id="Logo" src="assets/logo.png" alt="logo da barbearia"/>
                    </a>
               </div>          
               <div className="Menu">
                    <ul>
                        <li><button className="navhead " onClick={() => scrollToSection('about')}>HOME</button></li>
                        <li><button className="navhead " onClick={() => scrollToSection('servicos')}>SERVIÇOS</button></li>
                        <li><button className="navhead " onClick={() => scrollToSection('agendar')}>AGENDAR</button></li>
                        <li><button className="navhead " onClick={() => scrollToSection('contato')}>CONTATO</button></li>
                    </ul>
               </div>
            </nav>  
        </header>
    )
}

export default Header;