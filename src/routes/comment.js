const express = require('express');
const router = express.Router();

const commentController = require('../controller/commentController');
const auth = require('../middlewares/auth');
router.post('/register/:id', 
    auth,
    commentController.postComment
);

router.patch('/register/:id',
    auth,
    commentController.editComment
)

router.delete('/register/:id',
    auth,
    commentController.deleteComment
)
module.exports = router;