import React from 'react'; 
import './maps.css';


const Maps = () => {
    return (
        <div id="containermap">
            <section id="maps">
                <h1>ONDE ESTAMOS:</h1>
                <p>Praça Mauá, 1 - Centro</p>
                <p>Rio de Janeiro - RJ</p>
                <p>20081-240</p>
            </section>
                <iframe title='googlemaps' id="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.509395780311!2d-43.18218148976991!3d-22.89457483734693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f5732a12a31%3A0x316901f971660ce1!2sMuseu%20do%20Amanh%C3%A3!5e0!3m2!1sen!2sbr!4v1730658554838!5m2!1sen!2sbr" />
        </div>    
    )
};

export default Maps;