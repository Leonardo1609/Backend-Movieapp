const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

// MULTER
const multerConfig = {
    limitsize: { filesize : 100000 },
    storage: multer.diskStorage({
        destination: ( req, file, cb ) => {
            cb( null, __dirname + '../../public/img/profiles' )
        },
        filename: ( req, file, cb ) => {
            const extension = file.mimetype.split('/')[1];
            cb( null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter( req, file, cb ){
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
            cb( null, true);
        } else{
            cb( new Error('Format not valid'), false);
        }
    }
}

                                            // 'image' because I recieve from formData.get('image') 
const upload = multer( multerConfig ).single( 'image' );

exports.uploadImage = async ( req, res, next ) => {
    upload( req,res, error => {
        if( error ){
            if( error instanceof multer.MulterError ){
                if( error.code === 'LIMIT_FILE_SIZE' ){
                    res.status( 400 ).json({ 'message': 'Error, max 100kb '});
                } else{
                    res.status(400).json({ error });
                }
            } else{
                res.status(400).json({ error });
            }
        } else {
            next();
        }
    });
}

exports.createUser = async ( req, res ) => {
    const errors = validationResult( req );

    if( !errors.isEmpty() ){
        return res.status( 400 ).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ username });

        if( user ){
            return res.status(400).json({ msg: 'Username already exists'})
        }
        
        user = await User.findOne({ email });
        if( user ){
            return res.status(400).json({ msg: 'Email already exists'})
        }

        user = new User( req.body );
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hashSync( password, salt );

        await user.save();
    
        const payload = {
            user: {
                id: user.id
            }
        };
    
        jwt.sign( payload, process.env.SECRET, {
            expiresIn: 3600
        }, 
            ( error, token ) => {
                if ( error ) throw error;
                res.json({ token });
            }
        );
    } catch( error ){
        console.log( error );
        res.status(500).send('There was an error');
    }
}

exports.getUser = async ( req, res ) => {
    try {
        const { username } = req.query;

        const user = await User.findOne({ username }).select('-password -__v');

        if( !user ){
            res.status( 404 ).json({ msg: 'User not found' });
        }

        res.json({ user });
        
    } catch (error) {
        console.log( error );
        res.status(500).send('There was an error');
    }
}

exports.updateUser = async( req, res ) => {
    try {
        const user = await User.findById( req.user.id );
        const { username, email, biography, favorites } = req.body;
                
        const userExists = await User.findOne({ username });

        // si se quire modificar el username por un usuario que ya existe
        if( userExists && userExists.username !== user.username ){
            return res.status(400).json({ msg: 'Username invalid. User already exists' });
        } 

        user.username = username;
        user.email = email;
        user.biography = biography;
        user.favorites = favorites;
        
        await user.save();
        res.json({ user });
        
    } catch (error) {   
        console.log( error );
        res.status( 500 ).send( 'There was an error' );
    } 
}

exports.updateImage = async ( req, res ) => {
    
    try {
        const user = await User.findById( req.user.id );
    
        if( req.file && user.image ){
            const prevImage = __dirname + `../../public/img/profiles/${ user.image }`;
    
            fs.unlink( prevImage, ( error ) => {
                if( error ){
                    console.log( error );
                }
                return;
            })
        }
    
        if( req.file ){ // req.file por el campo del formulario desde el front end
            user.image = req.file.filename;
        }

        await user.save();
        res.json({ user });

    } catch (error) {
        console.log( error ); 
        res.status( 500 ).send( 'There was an error' );
    }
}

exports.changePassword = async ( req, res ) => {
    try {
        const { password, newPassword } = req.body;
        const user = await User.findById( req.user.id );

        const correctPassword = await bcrypt.compareSync( password, user.password );
        if( !correctPassword ){
            return res.status(400).json({ msg: 'Incorrect Password!' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hashSync( newPassword, salt );

        await user.save();
        res.json({ msg: "Password Changed!" });
        
    } catch (error) {
        console.log( error );
        res.status(500).send( 'There was an error' );
    }
}
