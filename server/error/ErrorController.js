const AppError = require('../utils/constants/appError')


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err
    })
}

const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'prod') {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        } else {
            let error = Object.create(err)
            if (error.name === "SequelizeDatabaseError") {
                if (err.original.code === "22P02") {
                    error = new AppError('cast error', 400)
                }
            }
            if(error.name === "SequelizeUniqueConstraintError"){
                if(err.original.code === "23505"){
                    error = new AppError(`The value with this key ${err.parameters[0]} already exists`, 400)
                }
            }
            if(error.name === "validationError"){
                const formattedError = [...error.errors].map(e=>e.msg)

                error.errors = formattedError
            }
            // if(error.name ====/)

            sendErrorProd(error,res)
        }
    }
}

module.exports = errorController