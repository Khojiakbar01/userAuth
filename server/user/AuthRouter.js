const express = require('express')
const app = express()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')

const authController = require('./authController')

const router = express.Router()
router.post('/signup',
    body('id', 'Please enter email or phone number').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty().trim().isLength({min: 6}).withMessage('Password must contain contain at least 6 characters'),
    authController.register)

router.post('/signin',
    body('id', 'Please enter email or phone number').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty().trim().isLength({min: 6}).withMessage('Password must contain contain at least 6 characters'),
    authController.login)

router.post('/new_token',
    body('refreshToken', 'Please enter refreshToken').notEmpty(),
    authController.refreshToken)

router.get('/info', authController.getUserById)
router.get('/logout', authMiddleware,authController.logout)


module.exports = router