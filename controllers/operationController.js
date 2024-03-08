const factory = require('./handlerFactory')
const Ordem = require('../models/ordemModel')
const Item = require('../models/itemModel')
const myReportc = require('./reports/facture')
const fs = require('fs')
var Buffer = require('buffer/').Buffer
var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');

exports.ordeService = factory.createOne(Ordem)
exports.addService = factory.createOne(Item)
exports.getOrdems = async (req, res) => {
    const doc = await Ordem.find({ ordem_status: 'pending' }).sort({ createdAt: -1, data: -1 })
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

exports.getOrdesByConditions = async (req, res) => {
    var doc = []
    var documentA = []
    var documentB = []
    var documentC = []

    documentA = await Ordem.find({
        client_telefone: req.body.ordem
    }).sort({ createdAt: -1, data: -1 })
    Array.prototype.push.apply(doc, documentA);

    documentB = await Ordem.find({
        client: new RegExp(req.body.ordem, 'i')
    }).sort({ createdAt: -1, data: -1 })
    Array.prototype.push.apply(doc, documentB);

    documentC = await Ordem.find({
        vehicleID: req.body.ordem
    }).sort({ createdAt: -1, data: -1 })
    Array.prototype.push.apply(doc, documentC);

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}

exports.removeOrdem = factory.deleteOne(Ordem)
exports.endOrdem = factory.updateOne(Ordem)
exports.getServices = factory.getAll(Item)
exports.removeService = factory.deleteOne(Item)

/*
async function backup() {
    const doc = await Ordem.find()
    const data = {
        data: doc
    }
    try {
        fs.writeFileSync('ordens.json', JSON.stringify(data));
        console.log('Done writing to file.');
    }
    catch(err) {
        console.log('Error writing to file', err)
    }
}
backup() 
*/


var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = process.env.PDF_API_KEY;

var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
/*
var filePath = "/temp/file.pdf";
var inputFile = Buffer.from(fs.readFileSync(__dirname + filePath).buffer)
*/

exports.getDocx = async (req, res) => {
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
            var elb = parseInt(tb)

            var options = { style: 'currency', currency: 'USD' }
            var form = new Intl.NumberFormat('en-US', options)
            var v = form.format(el)
            var vb = form.format(elb)

            setter.push([
                {
                    text: `${req.body.ordes[i].designation[index].qty}`,
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

    const report = await myReportc.facture({
        client: req.body.ordes[0].client,
        clientID: req.body.ordes[0].orderID,
        Nuit: '',
        rows: setter,
        total: total
    })

    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ')
            res.send({
                doc: response.body
            })
            /*
            fs.writeFile("./temp.docx",  response.body, function (err) {
              if (err) console.log(err);
              else console.log("done");
            })*/
        }
    }

    apiInstance.convertDocumentPdfToDocx(report, callback)
}





