const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const todoRoutes = require('./routes/todo.routes.js');
const path = require('path')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/todo', todoRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Đã xảy ra lỗi",
        error: err.message
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})