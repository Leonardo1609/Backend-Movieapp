const express = require('express');
const router = express.Router();

const commentController = require('../controller/commentController');
const auth = require('../middlewares/auth');
router.post('/register/:id', 
    auth,
    commentController.postComment
);

router.patch('/:id',
    auth,
    commentController.editComment
);

router.delete('/register/:registId/comment/:id',
    auth,
    commentController.deleteComment
);

router.get('/register/:id',
    commentController.getComments
);


module.exports = router;