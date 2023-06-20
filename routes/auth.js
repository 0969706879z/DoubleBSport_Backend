const express = require('express')
const router = express.Router()
const { register, login, currentUser } = require('../controllers/auth')

const { auth, adminCheck } = require('../middleware/auth')

router.get('/', (req, res) => {
    res.send("Hello Server")
})

router.post('/register', register)
router.post('/login', login)



router.post('/current-user', auth, currentUser)

router.post('/current-admin', auth, adminCheck, currentUser)


module.exports = router