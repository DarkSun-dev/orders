const mongoose = require('mongoose')
const validator = require('validator')

const clientSchema = new mongoose.Schema({
    clientID: {
        type: String,
        required: true,
        unique: true,
        required: [true, 'Por favor, forneca-nos um']
    },
    client: {
        type: String,
        unique: true,
        required: [true, 'Por favor, forneca-nos o nome do Cliente']
    },
    client_nuit: {
        type: String
    },
    client_address: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    client_telefone: {
        type: String,
        required: [true, 'Por favor, forneca-nos contacto do Cliente']
    }
}, {
    timestamps: true
})

const Client = mongoose.model('Client', clientSchema)
module.exports = Client