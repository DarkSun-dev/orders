const Ordem = require('../models/registerModel')
exports.ordemRegister = async (req, res) => {
    console.log(req.body)
    const doc = await Ordem.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}