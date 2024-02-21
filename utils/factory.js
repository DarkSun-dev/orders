
const catchAsync = require('./catchAsync')
const AppError = require('./appError')

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)
        res.status(201).json({
            status: 'success',
            resposta: {
                data: doc
            }
        })
    })

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        var query = Model.findById(req.params.id)
        if (popOptions) query = query.populate(popOptions)
        const doc = await query

        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    })

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.find()
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        })
    })