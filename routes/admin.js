const path = require('path');

const express = require('express');
const { body, check } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleWare/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth,
    [
        body('title')
        .isString()
        .isLength({ min: 3 })
            .trim(),
        body('price', 'Enter a valid number for the price.')
            .isFloat()
        ,
        body('description', 'Enter a description no more than 250 characters')
            .isLength({ min: 5, max: 400 }).trim(),

    ]
    , adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth,
    [
        body('title')
            .isString()
            .isLength({ max: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price', 'Enter a valid number for the price.')
            .isFloat()
        ,
        body('description', 'Enter a description no more than 250 characters')
            .isLength({ min: 5, max: 250 }),

    ]
    , adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
