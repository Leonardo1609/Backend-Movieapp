const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { enviarEmail } = require('../handlers/email');

exports.validateUser = async ( req, res ) => {
    
    const errors = validationResult( req );
    
    if ( !errors ){
        res.status( 401 ).json({ errors: erros.array() });
    }

    try {
        const { email, password } = req.body; 
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

exports.sendEmailToResetPassword = async ( req, res ) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if( !user ){
            res.status(404).json({ msg: "User doesn't exists" });
        }
    
        user.token = crypto.randomBytes(20).toString('hex');
        user.expires = Date.now() + 3600000;
        await user.save();
    
        const resetUrl = `http://localhost:3000/reset-password/${ user.token }`;
        await enviarEmail({
            user,
            subject: 'Password reset',
            resetUrl
        })

        res.json({ msg: 'Email sent' });

    } catch (error) {
        res.status(500).send('There was and error');
    }
}

exports.resetPassword = async ( req, res ) => {
    try {
        const user = await User.findOne({ token: req.params.token });
        const { newPassword } = req.body;
        console.log( newPassword );
        if( !user ){
            res.status(400).json({ msg:'Invalid Operation' });
        }
        
        if( user.expires < Date.now() ){
            res.status(400).json({ msg: 'Out of time, send your email again' });
            user.token = null;
            user.expires = null;
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hashSync( newPassword, salt );
        user.token = null;
        user.expires = null;
    
        await user.save();
        res.json({ 'msg': 'Password updated. Please login with your new password' });
    } catch (error) {
        console.log( error );
        res.send(500).status( 'There was an error' );
    }
    
}