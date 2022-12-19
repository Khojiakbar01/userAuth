const catchAsync = require('../utils/constants/catchAsync')
const {Op} = require('sequelize')
const jsonWebToken = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const User = require('../models/User')
const Post = require("../models/Post");
const {compare} = require("bcrypt");
const AppError = require("../utils/constants/appError");
const QueryBuilder = require("../utils/QueryBuilder");


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


const findByUsername = async (email) => {
    const user = await User.findOne({
        where: {email: {[Op.eq]: email}}
    })

    if (user) {
        return user
    }
    return null
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder
        .paginate()
        .sort()


    let allUsers = await User.findAndCountAll(queryBuilder.queryOptions);
    allUsers = queryBuilder.createPagination(allUsers)

    res.json({
        status: 'success',
        message: 'All users found',
        allUsers

    })
})

exports.getUserWithPost = catchAsync(async (req, res, next) => {
    const userWithPost = await User.findOne({
        where: {id: {[Op.eq]: req.params.id}},
        include: [
            "post"
        ]
    })
    let resArr = []
    userWithPost.post.map(e => {
        resArr.push(e.rating)

    })

    const sumRating = resArr.reduce((partialSum, a) => partialSum + a, 0)
    let avgRatingOfUser = (sumRating / userWithPost.post.length).toFixed(1)

    res.status(201).json({
        status: 'success',
        message: 'User found with posts',
        avgRatingOfUser: +avgRatingOfUser,
        posts: userWithPost
    })
})
exports.register = catchAsync(async (req, res, next) => {
    //Validation
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.errors = validationErrors.errors;
        err.isOperational = false;
        return next(err);
    }
    // console.log(req.body)

    const existingUser = await findByUsername(req.body.email);
    console.log(existingUser)
    if (existingUser) {
        return next(new AppError('Login already exists', 409))
    }

    const newUser = await User.create({...req.body})

    const payload = {
        id: newUser.id,
        email: newUser.email,

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
                email: newUser.email,
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


    const {email, password} = req.body;

    const candidate = await findByUsername(email);
    if (!candidate) {
        return next(new AppError('Login or password wrong', 400));
    }

    const passwordIsMatch = await compare(password, candidate.password)

    if (!passwordIsMatch) {
        return next(new AppError('Login or password wrong', 400));
    }

    const payload = {
        id: candidate.id,
        email: candidate.email,
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

    res.json({
        status: 'success',
        message: 'Successful Login',
        error: null,
        data: {
            user: {
                ...payload
            },
            jwt: token
        }
    })

})


// exports.getUserById = catchAsync(async (req, res, next) => {
//
//     const {id} = req.params
//
//     let byId = await User.findByPk(id);
//
//     if (!byId) {
//         return next(new AppError(`User with id ${id} not found`))
//     }
//
//     res.status(201).json({
//         status: 'success',
//         message: `User found with id ${id}`,
//         error: null,
//         data: {...byId}
//     })
// })

exports.logout = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.slice(7)
    let user = jsonWebToken.verify(token, process.env.SECRET_KEY)
    user.id = ''
    user.iat = 0
    user.exp = 0


    res.json({
        status: 'success',
        message: 'User logged out',

    })
}
