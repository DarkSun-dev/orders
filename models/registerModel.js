const mongoose = require('mongoose')
const registerSchema = new mongoose.Schema({
    orderID: {
        type: String, //order-user Telefone
        required: true
    },
    client: {
        type: String
    },
    client_telefone: {
        type: String,
        required: true
    },
    nuit: {
        type: String
    },
    client_address: {
        type: String
    },
    vehicleID: {
        type: String
    },
    class: {
        type: String,
        required: true
    },
    designation: Array,
    date: String,
    justification: {
        type: String,
        default: 'empty'
    },
    ordem_feedback: {
        type: String,
        default: 'empty'
    },
    ordem_status: {
        type: String,
        enum: ['pending', 'done', 'canceled'],
        default: 'pending'
    }
}, {
    timestamps: true
})

const Register = mongoose.model('Register', registerSchema, 'ordems')
module.exports = Register