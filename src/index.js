const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

connectDB();

// settings
app.set( 'port', process.env.PORT || 4000 );

// middlewares
app.use( express.json({ extended : false }) );
app.use( morgan('dev') );
app.use( cors() );

// routes
app.use( '/api/users', require('./routes/user') );
app.use( '/api/auth', require('./routes/auth') ); 
app.use( '/api/registers', require('./routes/register') );
app.use( '/api/comments', require('./routes/comment') );
app.use( '/api/list', require('./routes/listItems') );

app.listen( app.get('port'), () => {
    console.log('Connected to port', app.get('port'));
})