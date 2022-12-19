const express = require('express')
const app = express()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')

const authController = require('../controllers/authController')

const router = express.Router()


router.get('/', authController.getAllUsers)

router.post('/register',
    body('email', 'Please enter email').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty().trim().isLength({min: 6})
        .withMessage('Password must contain contain at least 6 characters'),
    authController.register)

router.post('/login',
    body('email', 'Please enter email').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty().trim().isLength({min: 6})
        .withMessage('Password must contain contain at least 6 characters'),
    authController.login)
router.get('/:id', authController.getUserWithPost)

router.get('/logout', authMiddleware, authController.logout)


module.exports = router