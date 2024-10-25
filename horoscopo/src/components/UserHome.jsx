import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/UserHome.css';

function UserHome({ user }) {
    const [codigo, setCodigo] = useState(""); 
    const [codigosRegistrados, setCodigosRegistrados] = useState([]); 
    const navigate = useNavigate();

    // Redirigir si no hay usuario (Esto es opcional)
    if (!user) {
        return <Navigate to="/" />;
    }

    // Función para manejar el registro del código
    const handleRegistrarCodigo = async (event) => {
        event.preventDefault();
    
        if (!codigo) {
            alert("Por favor, ingrese un código para registrar.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/v1/signos/registrarcodigo", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ codigo, usuario: user }), // Enviar usuario junto con el código
            });
    
            const data = await response.json();
    
            if (data.resultado === "Código registrado correctamente") {
                alert("Código registrado con éxito");
                setCodigo("");  // Limpiar el campo de entrada
                fetchCodigosRegistrados();  // Actualizar la tabla automáticamente
            } else {
                alert("Error al registrar el código: " + data.resultado);
            }
        } catch (error) {
            console.error("Error registrando el código:", error);
            alert("Hubo un problema al registrar el código.");
        }
    };

    // Función para obtener los códigos registrados del backend usando el método POST
const fetchCodigosRegistrados = async () => {
    try {
        const response = await fetch("http://localhost:4000/v1/signos/codigosregistrados", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario: user }) // Enviar el usuario para filtrar
        });

        const data = await response.json();
        setCodigosRegistrados(data.codigos || []);  // Guardar los códigos obtenidos
    } catch (error) {
        console.error("Error obteniendo los códigos:", error);
        alert("Hubo un problema al obtener los códigos registrados.");
    }
};


    // Cargar los códigos registrados al montar el componente
    useEffect(() => {
        fetchCodigosRegistrados();
    }, []);

    return (
        <div className="user-home">
            <h1>Bienvenido al sorteo, ¡Registra tu código!</h1>

            {/* Formulario para registrar código */}
            <form onSubmit={handleRegistrarCodigo} className="form-registrar">
                <label htmlFor="codigo">Registrar código:</label>
                <input
                    type="text"
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingresa tu código"
                />
                <button type="submit">Registrar</button>
            </form>

            {/* Tabla de códigos registrados */}
            <h2>Códigos Registrados</h2>
            <table className="tabla-codigos">
                <thead>
                    <tr>
                        <th>Fecha de Registro</th>
                        <th>Código Registrado</th>
                        <th>Premio</th>
                    </tr>
                </thead>
                <tbody>
                    {codigosRegistrados.length > 0 ? (
                        codigosRegistrados.map((codigoItem) => (
                            <tr key={codigoItem._id}>
                                <td>{new Date(codigoItem.fechaRegistro).toLocaleDateString()}</td>
                                <td>{codigoItem.codigo}</td>
                                <td>{codigoItem.premio || "No asignado"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay códigos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserHome;
