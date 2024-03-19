const factory = require('./handlerFactory')
const Invoice = require('../models/invoiceModel')

exports.getInvoice = async (req, res) => {
    const doc = await Invoice.find().sort({ invoiceID: -1})
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    })
}

exports.saveInvoice = factory.createOne(Invoice)

async function invoiceNumeber(document) {
    const doc = await Invoice.create(document)
    return doc
}