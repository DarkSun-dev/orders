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
        enum: ['paid', 'non-paid', 'pending'],
        default: 'pending'
    },
    entidade: {
        type: String,
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    ordes: Array
}, {
    timestamps: true
})

invoiceSchema.plugin(autoIncrement.plugin, { model: 'Invoice', field: 'invoiceID', startAt: 275 });
const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice