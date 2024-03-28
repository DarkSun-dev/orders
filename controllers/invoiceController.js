const factory = require('./handlerFactory')
const Invoice = require('../models/invoiceModel')
const myReportg = require('./reports/quotFat')

exports.getInvoice = async (req, res) => {
    const doc = await Invoice.find().sort({ createdAt: -1 })
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

exports.updateInvoiceStatus = async (req, res) => {
    const doc = await Invoice.findOneAndUpdate({ invoiceID: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}


exports.getClientInvoices = async (req, res) => {
    const doc = await Invoice.find({ entidade: req.params.id }).sort({ createdAt: -1 })
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

exports.saveInvoice = factory.createOne(Invoice)

exports.printInvoice = async (req, res) => {
    var setter = []
    var total = 0

    setter.push([
        { text: 'Qty', style: 'tableHeader', bold: true },
        { text: 'Item description', style: 'tableHeader', bold: true },
        { text: 'Unit Price', style: 'tableHeader', bold: true },
        { text: 'Total', style: 'tableHeader', bold: true }
    ])

    for (let i = 0; i < req.body.ordes.length; i++) {

        for (let index = 0; index < req.body.ordes[i].designation.length; index++) {
            var t = req.body.ordes[i].designation[index].unit_price
            var el = parseInt(t)

            var tb = req.body.ordes[i].designation[index].unit_price
            var elb = parseInt(tb) * parseInt(req.body.ordes[i].designation[index].qty)

            var options = { style: 'currency', currency: 'USD' }
            var form = new Intl.NumberFormat('en-US', options)
            var v = form.format(el)
            var vb = form.format(elb)

            setter.push([
                {
                    text: req.body.ordes[i].designation[index].qty,
                    border: [true, false, false, false]
                },
                {
                    text: req.body.ordes[i].vehicleID + " – " + req.body.ordes[i].designation[index].service + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: v.slice(1) + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: vb.slice(1) + "\n",
                    border: [true, false, true, false]
                }
            ])

            total = total + (parseInt(req.body.ordes[i].designation[index].unit_price) * parseInt(req.body.ordes[i].designation[index].qty))
        }
    }

    setter.push([
        {
            text: '\n\n\n\n\n\n\n\n\n\n',
            border: [true, false, true, true]
        },
        {
            text: '\n\n\n\n\n\n\n\n\n\n',
            border: [true, false, true, true]
        },
        {
            text: '\n\n\n\n\n\n\n\n\n\n',
            border: [true, false, true, true]
        },
        {
            text: '\n\n\n\n\n\n\n\n\n\n',
            border: [true, false, true, true]
        }
    ])

    //console.log(setter);

    const report = await myReportg.quotFat({
        client: req.body.ordes[0].client,
        clientID: req.body.ordes[0].orderID,
        invoiceID: req.body.invoiceID,
        docType: req.body.docType,
        docNum: req.body.docNum,
        date: req.body.docDate,
        Nuit: '',
        rows: setter,
        total: total,
        iva: req.body.iva,
        note: req.body.docNote
    })
    res.send({
        doc: report
    })

}