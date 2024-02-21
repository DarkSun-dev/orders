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
        required: [true, 'Por favor, forneca-nos o nome do Cliente']
    },
    client_nuit: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Por favor, forneca-nos o email do Cliente'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
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