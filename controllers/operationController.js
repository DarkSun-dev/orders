const factory = require('./handlerFactory')
const Ordem = require('../models/ordemModel')
const Item = require('../models/itemModel')
const fs = require('fs')

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
