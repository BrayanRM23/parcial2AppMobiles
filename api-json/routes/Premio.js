const mongoose = require('mongoose');

const PremioSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true, // Aseguramos que cada código sea único
    },
    premio: {
        type: String,
        required: true,
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
    },
});

const Premio = mongoose.model('Premio', PremioSchema);

module.exports = Premio;
