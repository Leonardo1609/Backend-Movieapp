const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controller/authController');
const auth = require('../middlewares/auth');

// /api/auth

router.post('/', [
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
], authController.validateUser );

router.get('/',
    auth,
    authController.getUser
);

module.exports = router;

