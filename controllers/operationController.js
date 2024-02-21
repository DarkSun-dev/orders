const factory = require('./handlerFactory')
const Ordem = require('../models/ordemModel')
const Item = require('../models/itemModel')

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
exports.removeOrdem = factory.deleteOne(Ordem)
exports.endOrdem = factory.updateOne(Ordem)
exports.getServices = factory.getAll(Item)
exports.removeService = factory.deleteOne(Item)
