const express = require('express')
const router = express.Router()

const { listUsers, readUsers, updateUsers, removeUsers, changeStatus, changeRole, userCart, getUserCart, saveAddress, saveOrder, getOrder, emptyCart, addToWishList, getWishList, removeWishList } = require('../controllers/users')

const { auth, adminCheck } = require('../middleware/auth')

router.get('/users', auth, adminCheck, listUsers)

router.get('/users/:id', readUsers)

router.put('/users/:id', auth, adminCheck, updateUsers)

router.delete('/users/:id', removeUsers)

router.post('/change-status', auth, adminCheck, changeStatus)

router.post('/change-role', auth, adminCheck, changeRole)

router.post('/user/cart', auth, userCart)

router.get('/user/cart', auth, getUserCart)

router.delete('/user/cart', auth, emptyCart)

router.post('/user/address', auth, saveAddress)

router.post('/user/order', auth, saveOrder)
router.get('/user/orders', auth, getOrder)


router.post('/user/wishlist', auth, addToWishList)
router.get('/user/wishlist', auth, getWishList)

router.put('/user/wishlist/:productId', auth, removeWishList)




module.exports = router