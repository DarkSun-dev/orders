const Item = require('../models/itemModel')
const factory = require('./handlerFactory')

exports.updateQty = factory.updateOne(Item)
exports.updateStoke = async (req, res) => {
    var docs = []
    console.log(req.body);
    for (let index = 0; index < req.body.length; index++) {
        var r = parseInt(req.body[index].stoke) - parseInt(req.body[index].qty)
        if (r >= 0) {
            const doc = await Item.findByIdAndUpdate(req.body[index].id, { stoke: r }, {
                new: true,
                runValidators: true
            })
        }else{
            docs.push({doc: req.body[index], message: 'non-stoke'})
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
          data: docs
        }
      })
}

exports.getStoke = async (req, res) => {
    const docs = await Item.find()
    const doc = docs.filter(el => el.stoke <= 0)
    res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      })
}