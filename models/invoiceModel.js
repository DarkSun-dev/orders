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
    ordes: Array
})

invoiceSchema.plugin(autoIncrement.plugin, { model: 'Invoice', field: 'invoiceID', startAt: 1 });
const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice