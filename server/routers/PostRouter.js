const express = require('express')
const app = express()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')

const postController = require('../controllers/postController')

const router = express.Router()
router.get('/', postController.getAllPosts)
router.post('/create',
    body('title', 'Please enter title').notEmpty().isLength({min: 6})
        .withMessage('Title must contain contain at least 6 characters'),
    body('content', 'Content cannot be empty').notEmpty().trim().isLength({min: 6})
        .withMessage('Content must contain contain at least 6 characters'),
    body('userId', 'Please choose userId').notEmpty().trim(),

    postController.createPost)

router.put('/update/:id',
    body('title', 'Please enter title').notEmpty().isLength({min: 6})
        .withMessage('Title must contain contain at least 6 characters'),
    body('content', 'Password cannot be empty').notEmpty().trim().isLength({min: 6})
        .withMessage('Content must contain contain at least 6 characters'),
    body('userId', 'Please choose userId').notEmpty().trim(),
    postController.updatePost)
router.delete('/delete/:id', postController.deletePost)

router.get('/:id', postController.getOnePost)
router.post('/:id', body('rating').isInt({min: 0, max: 5})
        .withMessage('Ratings must be within range of 0-5'),
    postController.ratePost)

module.exports = router