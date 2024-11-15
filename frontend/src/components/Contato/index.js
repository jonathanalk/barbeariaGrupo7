import React from 'react'; 
import './contato.css';


const Contato = () => {
    return (
        <section id="contato">
            <h2>CONTATO</h2>
            <div className="social-icons">
                <a href="https://www.instagram.com" className="icon instagram"><img src="assets/instagram.png" alt="icon_Instagram"/></a>
                <a href="https://www.facebook.com" className="icon facebook"><img src="assets/facebook.png" alt="icon_Facebook"/></a>
                <a href="https://x.com" className="icon twitter"><img src="assets/twitter.png" alt="icon_Twitter"/></a>
                <a href="https://web.whatsapp.com/" className="icon whatsapp"><img src="assets/whatsapp.png" alt="icon_Whatsapp"/></a>

            </div>
        </section>
    )
}
export default Contato;