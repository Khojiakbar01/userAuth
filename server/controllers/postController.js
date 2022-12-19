const Post = require('../models/Post');
const {Op} = require('sequelize')
const catchAsync = require('../utils/constants/catchAsync')
const {validationResult} = require('express-validator')
const AppError = require("../utils/constants/appError");
const QueryBuilder = require('../utils/QueryBuilder')

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder
        .paginate()
        .sort()

    let allPosts = await Post.findAndCountAll(queryBuilder.queryOptions);
    allPosts = queryBuilder.createPagination(allPosts)


    res.json({
        status: 'success',
        message: 'All Post found',
        data: {
            allPosts
        },

    })
})

exports.getOnePost = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const byId = await Post.findByPk(id);

    if (!byId) {
        return next(new AppError(`Post with id ${id} not found`))
    }

    const text = byId.content
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    res.status(201).json({
        status: 'success',
        message: 'Post found by Id',
        average_reading_minute: time,
        data: {byId}
    })
})

exports.ratePost = catchAsync(async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.name = 'validationError'
        err.errors = validationErrors.errors
        err.isOperational = false
        return next(err)
    }

    const {id} = req.params;
    const byId = await Post.findByPk(id);

    if (!byId) {
        return next(new AppError(`Post with id ${id} not found`))
    }
    let votersCount = byId.votersCount += 1
    let allRatings = byId.allRatings += req.body.rating

    const rating = allRatings / votersCount

    await byId.update({votersCount, allRatings, rating})

    res.json({
        status: 'success',
        message: 'Post rated',
    })
})


exports.createPost = catchAsync(async (req, res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.name = 'validationError'
        err.errors = validationErrors.errors
        err.isOperational = false
        return next(err)
    }

    const newPost = await Post.create(req.body)
    res.status(201).json({
        status: 'success',
        message: 'Post created successfully',
        data: {newPost}
    })
})

exports.updatePost = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        const err = new AppError('validation error', 400)
        err.name = 'validationError'
        err.errors = validationErrors.errors
        err.isOperational = false
        return next(err)
    }

    const {id} = req.params;
    const byId = await Post.findByPk(id);
    if (!byId) {
        return next(new AppError(`Post with id ${id} not found`))
    }

    const updatedPost = await byId.update(req.body);
    res.json({
        status: 'success',
        message: 'Post updated successfully',
        data: {updatedPost}
    })
})

exports.deletePost = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const byId = await Post.findByPk(id);
    if (!byId) {
        return next(new AppError(`Post with id ${id} not found`))
    }
    await byId.destroy()
    res.json({
        status: 'success',
        message: 'Post deleted successfully',
    })
})
