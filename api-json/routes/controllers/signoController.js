const fs = require('fs/promises');
const path = require('path');
const User = require('../user.model'); // Importa el modelo
const Codigo = require('../codigo');
const Premio = require('../Premio'); // Asegúrate de ajustar la ruta según tu estructura de carpetas

const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result)
}




const registrarcodigo = async (req, res) => {
    const { codigo, usuario } = req.body;

    try {
        // Verificar si el usuario existe, si no, crearlo
        let user = await User.findOne({ username: usuario });
        
        if (!user) {
            // Crear un nuevo usuario si no existe
            user = new User({ username: usuario });
            await user.save();
        }

        // Verificar si el código ya está registrado para ese usuario
        const codigoExistente = await Codigo.findOne({ codigo, usuario: user._id });
        if (codigoExistente) {
            return res.status(400).json({ resultado: "El código ya ha sido registrado por este usuario" });
        }

        // Crear el nuevo código asociado al usuario
        const nuevoCodigo = new Codigo({
            codigo,
            usuario: user._id,  // Asociar el código al usuario por su ID
            fechaRegistro: new Date(),
        });

        // Verificar si el código está en la colección de premios
        const premio = await Premio.findOne({ codigo });
        if (premio) {
            // Si el código tiene premio, asignarlo
            nuevoCodigo.premio = premio.premio; // Asignar el premio correspondiente
        } else {
            // Si no hay premio asociado, marcar como "sigue intentándolo"
            nuevoCodigo.premio = "Sigue intentándolo";
        }

        await nuevoCodigo.save();

        return res.json({ resultado: "Código registrado correctamente" });
    } catch (error) {
        console.error("Error registrando código:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};




const codigosregistrados = async (req, res) => {
    const { usuario } = req.body; // Obtener el usuario del body

    try {
        // Buscar el usuario por su nombre o ID en la base de datos
        const user = await User.findOne({ username: usuario });
        
        if (!user) {
            return res.status(400).json({ resultado: "Usuario no encontrado" });
        }

        // Buscar códigos asociados al usuario
        const codigos = await Codigo.find({ usuario: user._id }); // Filtrar códigos por el ID del usuario

        return res.json({ codigos }); // Enviar los códigos encontrados
    } catch (error) {
        console.error("Error obteniendo códigos registrados:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};



const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado: npm install bcrypt

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos solo por el username
        const user = await User.findOne({ username });

        if (!user) {
            // Si el usuario no existe
            return res.json({ resultado: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada (después de encriptarla)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.json({ resultado: "Credenciales inválidas" });
        }

        // Si el usuario es válido y la contraseña coincide
        return res.json({ resultado: "user" });

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};



const registrarpremio = async (req, res) => {
    const { codigo, premio } = req.body;

    try {
        // Verificar si el código ya existe
        const existingPremio = await Premio.findOne({ codigo });

        if (existingPremio) {
            return res.status(400).json({ resultado: "El código ya está registrado" });
        }

        // Crear el nuevo premio
        const nuevoPremio = new Premio({
            codigo,
            premio,
            fechaRegistro: new Date(),
        });

        await nuevoPremio.save();

        return res.json({ resultado: "Premio registrado correctamente" });
    } catch (error) {
        console.error("Error registrando el premio:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};



const updatepassword = async (req, res) => {
    const { username, password, update } = req.body;

    try {
        // Buscar al usuario en MongoDB
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`Usuario '${username}' no encontrado.`);
            return res.status(404).json({ resultado: "Usuario no encontrado" });
        }

        // Verificar la contraseña actual
        if (user.password !== password) {
            console.log(`Contraseña incorrecta para el usuario '${username}'.`);
            return res.status(400).json({ resultado: "Credenciales inválidas" });
        }

        // Actualizar la contraseña
        user.password = update;
        await user.save();

        console.log(`Contraseña del usuario '${username}' actualizada correctamente.`);
        return res.json({ resultado: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.log("Error al actualizar la contraseña:", error.message);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


const crearuser = async (req, res) => {
    const { username, password, birthdate, cedula, email, cellphone, city } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.json({ resultado: "El usuario ya existe" });
        }

        // Verificar si la cédula ya existe
        const cedulaExists = await User.findOne({ cedula });
        if (cedulaExists) {
            return res.json({ resultado: "La cédula ya está registrada" });
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 10;  // Número de rondas para generar el hash
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear un nuevo usuario con la contraseña encriptada y los otros campos
        const newUser = new User({
            username,
            password: hashedPassword,  // Guardar la contraseña encriptada
            birthdate,
            cedula,
            email,
            cellphone,
            city
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        return res.json({ resultado: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error creando usuario:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};




module.exports = {
    getAllSignos,
    registrarpremio,
    registrarcodigo,
    getOneSigno,
    codigosregistrados,
    compareLogin,
    updatepassword,
    crearuser
    
}