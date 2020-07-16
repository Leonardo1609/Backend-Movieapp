const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    password: {
        type: String,
        required: true 
    },
    biography: String,
    image: String
});

module.exports = mongoose.model( 'User', UserSchema );