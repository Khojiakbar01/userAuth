const express = require('express')
const app = express()
const router = express.Router();
const cors = require('cors')
const ErrorController = require('./error/ErrorController')
const AppError = require('./utils/constants/appError')
const authMiddleware = require('./middlewares/authMiddleware')
const cron = require("node-cron");

app.use(express.json())

//routes
const authRouter = require('./user/AuthRouter')
const attachmentRouter = require('./attachment/attachmentRouter')

app.use(cors())
app.use(express.static(__dirname + "/static"));

// cron.schedule("0 07 11 * * *", () => {
//     tempFileCleaner();
// });

app.use('/api/v1/user', authRouter)
app.use('/api/v1/file', attachmentRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Path ${req.path} is not found`, 404))
})
app.use(ErrorController)


module.exports = app

