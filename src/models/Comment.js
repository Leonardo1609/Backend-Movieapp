const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    register: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register'
    },
    postedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model( 'Comment', CommentSchema );


