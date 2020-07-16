const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.validateUser = async ( req, res, next ) => {
    
    const errors = validationResult( req );
    
    if ( !errors ){
        res.status( 401 ).json({ errors: erros.array() });
    }

    try {
        const { email, password } = req.body; 
        console.log( password );
        const user = await User.findOne({ email });

        console.log( user );
        if ( !user ){
            res.status( 404 ).json({ msg: "User doesn't exists" });
        }

        const correctPassword = await bcrypt.compareSync( password, user.password );

        if( !correctPassword ){
            res.status( 401 ).json({ msg: "Incorrect Credentials"});
        }        

        const payload = {
            user: {
                id: user.id 
            }
        }
        jwt.sign( payload, process.env.SECRET, {
            expiresIn: 3600
        }, ( error, token ) => {
            if ( error ) throw error;
            
            res.json({ token });
        });

    } catch (error) {
        console.log( error );
        res.status(500).send('There was an error');
    }

}

exports.getUser = async ( req, res ) => {
    try{
        const user = await User.findById( req.user.id ).select('-password -__v');
        res.json({ user });

    } catch ( error ){
        console.log( error );
        res.status( 500 ).send('There was an error');
    }
}