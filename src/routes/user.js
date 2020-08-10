const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controller/userController');
const auth = require('../middlewares/auth');

// /api/users

router.post( '/', [
    check('username', 'Username is required').notEmpty(),
    check('username', 'Username out of range (min. 6 characters, max. 15 characters').isLength({ min: 6, max: 15 }),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password out of range (min. 6 characters)').isLength({ min: 6 }),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Insert a valid email').isEmail()
], userController.createUser );


router.get('/', 
    userController.getUser
);

router.post('/edit-user',
    auth,
    userController.updateUser
);

router.post('/avatar-image',
    auth,
    userController.uploadImage,
    userController.updateImage,
);

router.post('/password',
    auth,
    userController.changePassword
);

module.exports = router;