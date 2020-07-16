const mongoose = require('mongoose');

const ListItemsSchema = mongoose.Schema({ 
    name : {
        type: String,
        required: true
    },
    description: String,
    items: [{
        title: String,
        release_date: String,
        id: Number,
        poster_path: String    
    }],
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model( 'ListItems', ListItemsSchema );
