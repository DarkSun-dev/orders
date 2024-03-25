const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    nota: String
})

const Nota = mongoose.model('Nota', noteSchema)
module.exports = Nota
