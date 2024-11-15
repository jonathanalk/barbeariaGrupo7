import React from 'react'; 
import './slogan.css';


const Slogan = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="slogan">
            <section>
                <h1>BARBEARIA XANDE</h1>
                <h2>A MELHOR</h2>
                <h2>BARBEARIA</h2>
                <h2>É A SUA</h2>
                <hr></hr>
                <hr></hr>
                <button className="rollAgendar" onClick={() => scrollToSection('agendar')}>AGENDAR AGORA!</button>
            </section>
        </div>
    )
};

export default Slogan;