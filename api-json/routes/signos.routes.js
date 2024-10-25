const express = require('express');
const router = express.Router();
const signoController = require('./controllers/signoController.js');



router
    .get('/', signoController.getAllSignos)
    .get('/:signo', signoController.getOneSigno)
    .post('/registrarcodigo', signoController.registrarcodigo)
    .post('/update', signoController.updateSigno)
    .post('/login', signoController.compareLogin)
    .post('/actualizar', signoController.updatepassword)
    .post('/crear', signoController.crearuser); // Nueva ruta para crear usuarios

module.exports = router;
