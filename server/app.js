const express = require('express')
const app = express()
const cors = require('cors')
const ErrorController = require('./error/ErrorController')
const AppError = require('./utils/constants/appError')
const authMiddleware = require('./middlewares/authMiddleware')


app.use(express.json())

//routes
const authRouter = require('./routers/AuthRouter')
const postRouter = require('./routers/PostRouter')

app.use(cors())


app.use('/api/v1/users', authRouter)
app.use('/api/v1/posts', postRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Path ${req.path} is not found`, 404))
})

app.use(ErrorController)


module.exports = app

