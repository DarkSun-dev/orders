const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    service: {
        type: String, //order-user Telefone
        required: true,
        unique: true
    },
    unit_price: {
        type: String,
        required: true
    },
    qty: {
        type: String,
        required: true
    },
    stoke: {
        type: Number
    },
    itemID: {
        type: String
    }
})

const Item = mongoose.model('Item', itemSchema)
module.exports = Item