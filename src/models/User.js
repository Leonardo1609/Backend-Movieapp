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
    favorites: [{
        name: String,
        release_date: String,
        id: Number,
        poster_path: String,
        itemType: String    
    }],
    biography: String,
    image: String,
    token: String,
    expires: Date
});

module.exports = mongoose.model( 'User', UserSchema );