const Ordem = require('../models/ordemModel')
const myReport = require('./reports/invoice')
const myReportb = require('./reports/invoiceReport')
const myReportc = require('./reports/facture')

exports.report = async (req, res) => {
    var setter = []
    setter.push([
        {
            text: 'ITEMS',
            fillColor: '#eaf2f5',
            border: [false, true, false, true],
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
        {
            text: '',
            border: [false, true, false, true],
            alignment: 'right',
            fillColor: '#eaf2f5',
            margin: [0, 5, 0, 5],
            textTransform: 'uppercase',
        },
    ])

    for (let index = 0; index < req.body.designation.length; index++) {
        setter.push([{
            text: req.body.designation[index].service,
            border: [false, false, false, true],
            margin: [0, 5, 0, 5],
            alignment: 'left',
        },
        {
            border: [false, false, false, true],
            text: '',
            fillColor: '#f5f5f5',
            alignment: 'right',
            margin: [0, 5, 0, 5],
        }
        ])
    }


    const report = await myReport.invoice({
        client: req.body.client,
        client_telefone: req.body.client_telefone,
        vehicleID: req.body.vehicleID,
        orderID: req.body.orderID,
        date: req.body.date,
        ordem_status: req.body.ordem_status,
        rows: setter,
        total: sum(req.body.designation)
    })

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


exports.rangeReport = async (req, res) => {
    const start = '15/02/2024, 00:00:00'
    const end = '18/02/2024, 23:59:00'
    const doc = await Ordem.find({
        date: {
            $gte: start,
            $lt: end
        }
    })

    res.send({
        doc: doc
    })
}



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
            setter.push([
                {
                    text: `1`
                },
                {
                    text: req.body.ordes[i].designation[index].service+" – "+req.body.ordes[i].vehicleID
                },
                {
                    text: req.body.ordes[i].designation[index].unit_price,
                },
                {
                    text: req.body.ordes[i].designation[index].unit_price,
                }
            ])

            total = total + parseInt(req.body.ordes[i].designation[index].unit_price)
        }
    }

    //console.log(setter);

    const report = await myReportc.facture({
        client: req.body.ordes[0].client,
        Nuit: 'xxxxxx',
        rows: setter,
        total: total
    })
    res.send({
        doc: report
    })
}




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
                margin: [0, 5, 0, 5],
                alignment: 'left',
            },
            {
                border: [false, false, false, true],
                text: req.body.ordes[i].designation[index].unit_price,
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