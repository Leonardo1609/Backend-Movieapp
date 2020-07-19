const mongoose = require('mongoose');

const RegisterSchema = mongoose.Schema({
    // TODO: Considerar quitar el nombre
    name: {
        type: String,
        required: true
    },
    itemType: {
        required: true,
        type: String
    },
    // No es el id principal, es el id que obtendré del id de TMDB
    id: {
        required: true,
        type: Number
    },
    poster_path: String,
    score: Number,
    watched: {
        type: Boolean,
        default: false
    },
    watchlist: {
        type: Boolean,
        default: false
    },
    liked: {
        type: Boolean,
        default: false
    },
    review: String,
    usersLikes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    registeredAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model( 'Register', RegisterSchema );