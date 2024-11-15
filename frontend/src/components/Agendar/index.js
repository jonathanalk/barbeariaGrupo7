import React, { useContext } from 'react'; 
import  Context from '../AuthContext/context';
import './agendar.css';



const Agendar = ({onClick}) => {
    const [isLoginIn] = useContext(Context);

    return (       
        <section id="agendar">
            <h1>HORÁRIOS DISPONÍVEIS</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>MANHÃ</th>
                            <td>08:30</td>
                            <td>09:00</td>
                            <td>09:30</td>
                            <td>10:00</td>
                            <td>10:30</td>
                            <td>11:00</td>
                            <td>11:30</td>
                            <td>12:00</td>
                        </tr>
                        <tr>
                            <th>TARDE</th>
                            <td>12:30</td>
                            <td>13:00</td>
                            <td>13:30</td>
                            <td>14:00</td>
                            <td>14:30</td>
                            <td>15:00</td>
                            <td>15:30</td>
                            <td>16:00</td>
                        </tr>
                    </tbody>    
                </table>
                {isLoginIn ? (<button id="marcarCorte" onClick={onClick}>AGENDAR</button>) :
                <p>Você precisa Logar para agendar.</p>}

        </section>
    )
}

export default Agendar;