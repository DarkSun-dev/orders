const Ordem = require('../models/ordemModel')
const Invoice = require('../models/invoiceModel')
const Note = require('../models/noteModel')

const myReport = require('./reports/ordem')
const myReportb = require('./reports/invoiceReport')
const myReportc = require('./reports/facture')
const myReportd = require('./reports/balance')
const myReporte = require('./reports/generalFat')
const myReportf = require('./reports/quote')
const myReportg = require('./reports/quotFat')



async function invoiceNumeber(document) {
    const doc = await Invoice.create(document)
}

async function note(document) {
    const doc = await Note.create(document)
}

exports.report = async (req, res) => {

    var options = { style: 'currency', currency: 'USD' }
    var form = new Intl.NumberFormat('en-US', options)
    var downTab = []
    var setter = []
    var row = ""

    setter.push([
        {
            text: 'ITEMS',
            fillColor: '#eaf2f5',
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: req.body.class === 'a' ? 'Preço' : '',
            border: [false, true, false, true],
            alignment: 'right',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
    ])

    downTab.push([
        {
            text: 'ITEMS',
            fillColor: '#eaf2f5',
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase'
        },
        {
            text: '',
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'right',
            fillColor: '#eaf2f5',
            margin: [Array],
            textTransform: 'uppercase'
        }
    ])


    for (let index = 0; index < req.body.designation.length; index++) {
        row += "#" + req.body.designation[index].qty + " – " + req.body.designation[index].service + ";"
    }

    setter.push([
        {
            //text: req.body.designation[index].service,
            text: row,
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            color: '#333333',
            fontSize: 11,
            alignment: 'left',
        },
        {
            border: [false, false, false, true],
            text: req.body.class === 'a' ? form.format(parseInt(req.body.designation[index].unit_price)).slice(1) : '',
            fillColor: '#f5f5f5',
            alignment: 'right',
            margin: [0, 5, 0, 5],
        }
    ])

    downTab.push([
        {
            //text: req.body.designation[index].service,
            text: row,
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            color: '#333333',
            fontSize: 11,
            alignment: 'left',
        },
        {
            border: [false, false, false, true],
            text: req.body.class === 'a' ? form.format(parseInt(req.body.designation[index].unit_price)).slice(1) : '',
            fillColor: '#f5f5f5',
            alignment: 'right',
            margin: [0, 5, 0, 5],
        }
    ])

    const report = await myReport.ordem({
        client: req.body.client,
        client_telefone: req.body.client_telefone,
        nuit: req.body.nuit,
        address: req.body.client_address,
        vehicleID: req.body.vehicleID,
        orderID: req.body.orderID,
        date: req.body.date,
        class: req.body.class,
        ordem_status: req.body.ordem_status,
        ordem_feedback: req.body.ordem_feedback === 'empty' ? 'not' : 'yes',
        rows: setter,
        total: sum(req.body.designation)
    }, downTab)
    res.send({
        doc: report
    })
}

const sum = (arr) => {
    var x = 0
    for (let index = 0; index < arr.length; index++) {
        x = x + parseInt(arr[index].unit_price)
    }
    return x
}

//==========================================

exports.rangeReport = async (req, res) => {
    const start = req.body.start
    const end = req.body.end
    //'2024-02-22'
    const doc = await Ordem.find({
        createdAt: {
            $gte: start,
            $lte: end
        },
        orderID: req.body.orderID,
        ordem_status: req.body.ordem_status
    }).sort({ createdAt: -1, data: -1 })
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

//==========================================

exports.anyReport = async (req, res) => {
    const start = req.body.start
    const end = req.body.end
    //'2024-02-22'
    const doc = await Ordem.find({
        createdAt: {
            $gte: start,
            $lte: end
        },
        class: req.body.class,
        ordem_status: req.body.ordem_status
    }).sort({ createdAt: -1, data: -1 })
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

//==========================================


exports.factura = async (req, res) => {
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
    invoiceNumeber({ ordes: req.body.ordes, entidade: req.body.ordes[0].orderID, total: total})
    const report = await myReportc.facture({
        client: req.body.ordes[0].client,
        clientID: req.body.ordes[0].orderID,
        invoiceID: req.body.invoiceID,
        Nuit: '',
        rows: setter,
        total: total
    })
    res.send({
        doc: report
    })
}

//==========================================

exports.invoiceReport = async (req, res) => {
    var setter = []
    var total = 0
    setter.push([
        {
            text: 'DATA DE ORDEM – ITEM – VEÍCULO ID',
            fillColor: '#eaf2f5',
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: 'TOTAL',
            border: [false, true, false, true],
            alignment: 'right',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
    ])

    for (let i = 0; i < req.body.ordes.length; i++) {


        for (let index = 0; index < req.body.ordes[i].designation.length; index++) {
            setter.push([{
                text: req.body.ordes[i].date + " –  " + req.body.ordes[i].designation[index].service + " – " + req.body.ordes[i].vehicleID,
                border: [false, false, false, true],
                lineHeight: 1.50,
                margin: [0, 5, 0, 5],
                alignment: 'left',
            },
            {
                border: [false, false, false, true],
                text: req.body.ordes[i].designation[index].unit_price,
                lineHeight: 1.50,
                fillColor: '#f5f5f5',
                alignment: 'right',
                margin: [0, 5, 0, 5],
            }
            ])

            total = total + parseInt(req.body.ordes[i].designation[index].unit_price)

        }

    }

    const report = await myReportb.invoiceReport({
        client: req.body.ordes[0].client,
        orderID: req.body.ordes[0].orderID,
        rows: setter,
        total: total
    })

    res.send({
        doc: report,
    })
}

//==========================================

exports.balance = async (req, res) => {
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
            setter.push([
                {
                    text: req.body.ordes[i].designation[index].qty + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: req.body.ordes[i].designation[index].service + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: req.body.ordes[i].designation[index].unit_price,
                    border: [true, false, false, false]
                },
                {
                    text: parseInt(req.body.ordes[i].designation[index].unit_price) * parseInt(req.body.ordes[i].designation[index].qty),
                    border: [true, false, true, false]
                }
            ])

            total = total + (parseInt(req.body.ordes[i].designation[index].unit_price) * parseInt(req.body.ordes[i].designation[index].qty))
        }
    }

    setter.push([
        {
            text: '\n',
            border: [true, false, true, true]
        },
        {
            text: '\n',
            border: [true, false, true, true]
        },
        {
            text: '\n',
            border: [true, false, true, true]
        },
        {
            text: '\n',
            border: [true, false, true, true]
        }
    ])


    const report = await myReportd.balance({
        client: req.body.ordes[0].client,
        Nuit: 'xxxxxx',
        rows: setter,
        total: total
    })
    res.send({
        doc: report
    })
}

//========================================
exports.generalFat = async (req, res) => {

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
                    text: req.body.ordes[i].designation[index].qty + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: req.body.ordes[i].designation[index].service + "\n",
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

    invoiceNumeber({ ordes: req.body.ordes, entidade: req.body.ordes[0].orderID, total: total })
    const report = await myReporte.generalFat({
        client: req.body.ordes[0].client,
        clientID: req.body.ordes[0].orderID,
        invoiceID: req.body.invoiceID,
        Nuit: '',
        vehicleID: req.body.ordes[0].vehicleID,
        orderID: req.body.ordes[0].orderID,
        date: req.body.ordes[0].date,
        rows: setter,
        total: total
    })
    res.send({
        doc: report
    })
}



//========================================
exports.quoteFat = async (req, res) => {
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
                    text: req.body.ordes[i].designation[index].qty + "\n",
                    border: [true, false, false, false]
                },
                {
                    text: req.body.ordes[i].designation[index].service + "\n",
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

    const report = await myReportf.quote({
        client: req.body.ordes[0].client,
        clientID: req.body.ordes[0].orderID,
        nuit: req.body.ordes[0].nuit,
        address: req.body.ordes[0].address,
        vehicleID: req.body.ordes[0].vehicleID + "".toLowerCase(),
        orderID: req.body.ordes[0].orderID,
        docNum: req.body.docNum,
        date: req.body.ordes[0].date,
        rows: setter,
        docType: req.body.docType,
        total: total
    })
    res.send({
        doc: report
    })
}


//=========================Quot.Emmiter
exports.quotFactura = async (req, res) => {
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
    //invoiceNumeber({ ordes: req.body.ordes, entidade: req.body.ordes[0].orderID})
    if(req.body.docType === 'Factura' && req.body.count === 'yes'){
        invoiceNumeber({ ordes: req.body.ordes, entidade: req.body.ordes[0].orderID, total: total})
    }
    
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


//===============================================================================