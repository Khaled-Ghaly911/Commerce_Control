const express = require('express');
// const { check } = require('express-validator/lib/middlewares/check');
const { body, check } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
    body('email')
    .isEmail()
    .withMessage('Please enter a valid Email address.')
    .normalizeEmail(),
    body('password', 'password has to be valid')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim()
    ,authController.postLogin);

router.post('/signup',
    [body('email')
        .isEmail()
        .withMessage('Enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                })
        })
        .normalizeEmail(),

    body('password', 'please enter a password with only numbers and text and at least 5 character.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),

    body('confirmPassword')
    .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password have to match!');
            }
            return true;
        })]
    , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword)


module.exports = router;