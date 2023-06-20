const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { readdirSync } = require('fs')
require('dotenv').config()
const connectDB = require('./config/db')
connectDB()

app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '20mb' }))
app.use(cors())

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))

app.get('/test', (req, res) => {
    res.send("Test")
})
app.listen(port, () => console.log("Server is running on port: " + port))
