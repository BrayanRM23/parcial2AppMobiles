import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Crearusuarios() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");   // Nuevo estado para fecha de nacimiento
    const [cedula, setCedula] = useState("");         // Nuevo estado para cédula
    const [email, setEmail] = useState("");           // Nuevo estado para correo
    const [cellphone, setCellphone] = useState("");   // Nuevo estado para celular
    const [city, setCity] = useState("");             // Nuevo estado para ciudad

    const goTo = useNavigate();

    const crearuser = (event) => {
        event.preventDefault();

        // Asegurarse de que los campos no estén vacíos
        if (!username || !password || !birthdate || !cedula || !email || !cellphone || !city) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        fetch(`http://localhost:4000/v1/signos/crear`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username, 
                password,  
                birthdate,    // Enviando fecha de nacimiento
                cedula,       // Enviando cédula
                email,        // Enviando correo
                cellphone,    // Enviando celular
                city          // Enviando ciudad
            })
        })
        .then(res => res.json())
        .then(responseData => {
            if (responseData.resultado === 'Usuario creado correctamente') {
                alert("Usuario creado correctamente");
                goTo("/Form");  // Redirigir a la página de inicio de sesión
            } else {
                alert("Error al crear usuario");
            }
        })
        .catch(error => {
            console.error("Error en la creación de usuario:", error);
            alert("Hubo un error en la solicitud. Inténtalo de nuevo.");
        });
    };

    return (
        <form onSubmit={crearuser}>
            <h1 id="txtBienvenida">Regístrate</h1>
            
            <h4 className="txt">Nombre de Usuario</h4>  
            <input type="text" className="entry" value={username} onChange={(e) => setUsername(e.target.value)} /><br />

            <h4 className="txt">Crear Contraseña</h4>  
            <input type="password" className="entry" value={password} onChange={(e) => setPassword(e.target.value)} /><br />

            <h4 className="txt">Fecha de Nacimiento</h4>
            <input type="date" className="entry" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} /><br />

            <h4 className="txt">Cédula</h4>
            <input type="text" className="entry" value={cedula} onChange={(e) => setCedula(e.target.value)} /><br />

            <h4 className="txt">Correo Electrónico</h4>
            <input type="email" className="entry" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

            <h4 className="txt">Número de Celular</h4>
            <input type="tel" className="entry" value={cellphone} onChange={(e) => setCellphone(e.target.value)} /><br />

            <h4 className="txt">Ciudad</h4>
            <input type="text" className="entry" value={city} onChange={(e) => setCity(e.target.value)} /><br />

            <input type="submit" value="Crear" id="btnEnviar" />
        </form> 
    );
}

export default Crearusuarios;
