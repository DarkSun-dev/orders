const express = require('express')
const operationController = require('./../controllers/operationController')
const clientController = require('./../controllers/clientController')
const reportController = require('./../controllers/reportController')
const router = express.Router()


router.get('/getService', operationController.getServices)
router.get('/getService/:id', clientController.getMyServices)
router.get('/getOrdems', operationController.getOrdems)

router.post('/getReport', reportController.report)

router.post('/getInvoiceReport', reportController.invoiceReport)

router.post('/facture', reportController.factura)

router.post('/balance', reportController.balance)

router.post('/createService', operationController.addService)
router.post('/ordeService', operationController.ordeService)
router.post('/createClient', clientController.addClient)

router.delete('/removeService/:id', operationController.removeService)
router.delete('/removeOrdem/:id', operationController.removeOrdem)

router.patch('/endOrdem/:id', operationController.endOrdem)
router.get('/verifyClient/:id', clientController.verifyClient)
router.get('/getClients', clientController.getClients)

router.get('/getOrdes/:id', clientController.getOrdes)

router.post('/rangeDate', reportController.rangeReport)
router.post('/anyReport', reportController.anyReport)



module.exports = router