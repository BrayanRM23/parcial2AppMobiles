import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/ganadores.css';

function Ganadores() {
    const [codigo, setCodigo] = useState(""); // Estado para el código
    const [premio, setPremio] = useState(""); // Estado para el premio
    const navigate = useNavigate();

    // Función para manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!codigo || !premio) {
            alert("Por favor, complete ambos campos para continuar.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/v1/signos/premios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ codigo, premio }), // Enviar código y premio al backend
            });

            const data = await response.json();

            if (data.resultado === "Premio registrado correctamente") {
                alert("Premio registrado con éxito");
                setCodigo(""); // Limpiar el campo de entrada de código
                setPremio(""); // Limpiar el campo de entrada de premio
            } else {
                alert("Error al registrar el premio: " + data.resultado);
            }
        } catch (error) {
            console.error("Error registrando el premio:", error);
            alert("Hubo un problema al registrar el premio.");
        }
    };

    return (
        <div className="ganadores">
            <h1>Registrar Premio</h1>
            <form onSubmit={handleSubmit} className="form-registrar-premio">
                <label htmlFor="codigo">Código:</label>
                <input
                    type="text"
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingresa el código"
                />
                <label htmlFor="premio">Premio:</label>
                <input
                    type="text"
                    id="premio"
                    value={premio}
                    onChange={(e) => setPremio(e.target.value)}
                    placeholder="Ingresa el premio"
                />
                <button type="submit">Registrar Premio</button>
            </form>
        </div>
    );
}

export default Ganadores;

