const mongoose = require('mongoose')
const resetSchema = new mongoose.Schema({
    telefone: {
        type: String
    },
    password: {
        type: String
    }
})

const Reset = mongoose.model('Reset', resetSchema)
module.exports = Reset