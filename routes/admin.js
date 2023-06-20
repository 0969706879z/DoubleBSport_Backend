const express = require('express')
const router = express.Router()
const { changeOrderStatus, getOrderAdmin } = require('../controllers/admin')
const { auth, adminCheck } = require('../middleware/auth')

router.put('/admin/order-status', auth, adminCheck, changeOrderStatus)
router.get('/admin/orders', auth, adminCheck, getOrderAdmin)


module.exports = router