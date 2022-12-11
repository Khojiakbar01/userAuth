const {v4: uuidv4} = require('uuid');
const catchAsync = require('../utils/constants/catchAsync')
const {Op} = require('sequelize')
const jsonWebToken = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const User = require('./User')
const {compare} = require("bcrypt");
const AppError = require("../utils/constants/appError");


const generateToken = (payload, jwtSecret, options) => {
    return new Promise((resolve, reject) => {
        jsonWebToken.sign(
            payload,
            jwtSecret,
            options, (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(token)
                }
            }
        )
    })
}


const findByUsername = async (id) => {
    const user = await User.findOne({
        where: {id: {[Op.eq]: id}}
    })
    if (user) {
        return user
    }
    return null
}

exports.register = catchAsync(async (req, res, next) => {

    //Validation
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.errors = validationErrors.errors;
        err.isOperational = false;
        return next(err);
    }

    const existingUser = await findByUsername(req.body.id);

    if (existingUser) {
        return next(new AppError('Login already exists', 409))
    }

    const newUser = await User.create({...req.body})

    const payload = {
        id: newUser.id,
    }

    const JWTSecret = process.env.SECRET_KEY
    const token = await generateToken(
        payload,
        JWTSecret,
        {
            algorithm: 'HS512',
            expiresIn: '10m'
        }
    )

    res.json({
        status: 'success',
        message: 'Registration  successfully completed',
        error: null,
        data: {
            user: {
                id: newUser.id,

            },
            jwt: token
        }
    })
})


exports.login = catchAsync(async (req, res, next) => {


    //Validation
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.errors = validationErrors.errors;
        err.isOperational = false;
        return next(err);
    }


    const {id, password} = req.body;

    const candidate = await findByUsername(id);
    if (!candidate) {
        return next(new AppError('Login or password wrong', 400));
    }

    const passwordIsMatch = await compare(password, candidate.password)

    if (!passwordIsMatch) {
        return next(new AppError('Login or password wrong', 400));
    }

    const payload = {
        id: candidate.id,
    }

    //Token generation
    const JWTSecret = process.env.SECRET_KEY
    const token = await generateToken(
        payload,
        JWTSecret,
        {
            algorithm: 'HS512',
            expiresIn: '10m'
        }
    )

    const refreshToken = await jsonWebToken.sign(payload, process.env.REFRESH_SECRET_KEY, {
        algorithm: 'HS512',
        expiresIn: '24h'
    })
    res.json({
        status: 'success',
        message: 'Successful Login',
        error: null,
        data: {
            user: {
                ...payload
            },
            jwt: {token, refreshToken}
        }
    })

})

exports.refreshToken = catchAsync(async (req, res, next) => {
    //Validation
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.errors = validationErrors.errors;
        err.isOperational = false;
        return next(err);
    }


    const data = req.body

    if ((data.refreshToken)) {
        const payload = {
            id: data.id,
            // "name": postData.name
        }

        const token = await jsonWebToken.sign(payload, process.env.REFRESH_SECRET_KEY, {
            algorithm: 'HS512',
            expiresIn: '15'
        })
        const response = {
            token,
        }

        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})

exports.getUserById = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.slice(7)

    const user = jsonWebToken.verify(token, process.env.SECRET_KEY)

    // const {id} = req.params
    const id = user.id
    let byId = await User.findByPk(id);

    if (!byId) {
        return next(new AppError(`User with id ${id} not found`))
    }
    byId = byId.id
    res.status(201).json({
        status: 'success',
        message: `User found with id ${id}`,
        error: null,
        data: {byId}
    })
})

exports.logout = async (req, res,next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.slice(7)
    let user = jsonWebToken.verify(token, process.env.SECRET_KEY)
    user.id=''
    user.iat=0
    user.exp=0

    console.log(user)

    res.json({
        status: 'success',
        message: 'User logged out',

    })
}
