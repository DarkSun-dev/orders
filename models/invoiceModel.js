const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection);
const invoiceSchema = new mongoose.Schema({
    invoiceID: {
        type: Number,
        unique: true,
        required: true
    },
    invoice_status: {
        type: String,
        enum: ['paid', 'non-paid', 'parcial-paid'],
        default: 'non-paid'
    },
    entidade: {
        type: String,
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    total: Number,
    due: {
        type: Number,
        default: 0
    },
    ordes: Array
}, {
    timestamps: true
})

invoiceSchema.plugin(autoIncrement.plugin, { model: 'Invoice', field: 'invoiceID', startAt: process.env.FAT_INIT });
const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice