const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const listController = require('../controller/listController');

router.post('/', 
    auth,
    listController.createList
);

router.put('/:id', 
    auth,
    listController.modifyList
);

router.delete('/:id', 
    auth,
    listController.deleteList
);

module.exports = router;