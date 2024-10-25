import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ callback }) {
    const [username, setUsername] = useState("");  
    const [password, setPassword] = useState("");  
    const goTo = useNavigate();

    const validateUser = (event) => {
        event.preventDefault();

        if (!username || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Simple validación sin autenticación
        fetch('http://localhost:4000/v1/signos/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(responseData => {
            // Asumimos que el usuario está autenticado si existe un resultado
            if (responseData.resultado === 'user') {
                callback(username);
                goTo('/userHome');
            } else if (responseData.resultado === 'admin') {
                callback(username);
                goTo("/adminHome");
            } else {
                alert("Credenciales inválidas");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error en la solicitud. Inténtalo de nuevo.");
        });
    };

    return (
        <form onSubmit={validateUser}>
            <h1 id="txtBienvenida">¡Gana como Loco!</h1>
            
            <h4 className="txt">Nombre de Usuario</h4>  
            <input 
                type="text" 
                className="entry" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            /><br />

            <h4 className="txt">Contraseña</h4>  
            <input 
                type="password" 
                className="entry" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            /><br />

            <input type="submit" value="Ingresar" id="btnEnviar" />

            <button onClick={() => goTo("/crearusers")} id="forgotPasswordLink">Registrarme</button>
        </form>   
    );
}

export default Form;

