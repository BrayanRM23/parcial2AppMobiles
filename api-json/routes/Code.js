const mongoose = require('mongoose');

const CodigoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    premio: {
        type: String,
        default: "No asignado"
    }
});

const Codigo = mongoose.model('Codigo', CodigoSchema);

module.exports = Codigo;

