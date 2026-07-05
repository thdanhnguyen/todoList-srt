const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const todoRoutes = require('./routes/todo.routes.js');

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/todo', todoRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Đã xảy ra lỗi",
        error: err.message
    })
})