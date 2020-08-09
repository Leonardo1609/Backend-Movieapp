const express = require('express');
const router = express.Router();

const registerController = require('../controller/registerController');
const auth = require('../middlewares/auth');

// /api/registers
router.post('/',
    auth,
    registerController.registerItem
);

router.patch('/:id',
    auth,
    registerController.updateRegister
);

// Llamar los registros de cualquier usuario según su username
router.get('/public', 
    registerController.getRegistersOfUser
);

// Llamar los registros del usuario logueado
router.get('/',
    auth,
    registerController.getRegisters
);

router.get('/:id/:type',
    registerController.getRegisterOfUser
);

router.patch('/likes/:id', 
    auth,
    registerController.updateLikes
);

router.delete('/:id',
    auth,
    registerController.removeRegister
)

module.exports = router;