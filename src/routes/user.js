const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controller/userController');
const auth = require('../middlewares/auth');

// /api/users

router.post( '/', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password out of range (min. 6 characteres)').isLength({ min: 6 }),
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
)

module.exports = router;