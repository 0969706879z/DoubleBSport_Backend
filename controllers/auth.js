const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body
        var user = await User.findOne({ username })
        if (user) {
            return res.status(400).send('User Already exists')
        }
        const salt = await bcrypt.genSalt(10)
        user = new User({
            username,
            password
        })
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        res.send("Register Success")
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        var user = await User.findOneAndUpdate({ username }, { new: true })
        if (user && user.enabled) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).send("Password Invalid !!!")
            }

            const payload = {
                user: {
                    username: user.username,
                    role: user.role
                }
            }
            jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token, payload })
            })
        } else {
            return res.status(400).send("User not Found !!!")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error !!! ")
    }
}

exports.currentUser = async (req, res) => {
    try {
        console.log("Controller", req.user)
        const user = await User.findOne({ username: req.user.username }).select('-password').exec()
        console.log(user)
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error !!! ")
    }
}