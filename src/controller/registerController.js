const Register = require('../models/Register');
const User = require('../models/User');

exports.registerItem = async ( req, res ) => {
    
    try {
        const registerExists = await Register.findOne({ user: req.user.id, id: req.body.id, name: req.body.name }); 

        if( registerExists ){
            return res.status(400).json({ 'message' : "You can't register this movie/serie again" })
        }
        const register = new Register( req.body );
        register.user = req.user.id;
        await register.save();

        res.json({ register, message: 'Registered'});

    } catch (error) {
        console.log( error );
        res.status(500).send('There was an error');
    }
}

// Obtener registros según el usuario
exports.getRegistersOfUser = async ( req, res ) => {
    try {

        const { username } = req.query;
        const user = await User.findOne({ username });
        const registers = await Register.find({ user: user._id }).sort({ registeredAt: 'desc' });
        
        if ( !registers ) {
            return res.json({ 'message' : 'Not registers' } )
        }

        res.json({ registers })

    } catch (error) {
        console.log( error );
        res.status( 500 ).send('There was an error');
    }
}

exports.getRegisters = async ( req, res ) => {
    try {
        const registers = await Register.find({ user: req.user.id }).sort({ registeredAt: 'desc' });

        if ( !registers ) {
            return res.json({ 'message' : 'Record a movie or serie' });
        }

        res.json({ registers });

    } catch (error) {
        console.log( error );
        res.status( 500 ).send('There was an error')
    }
}

exports.getRegisterOfUser = async ( req, res ) => {
    try {
        const register = await Register.findOne({ id: req.params.id, user: req.body.userId });

        if ( !register ){
            return res.status( 404 ).json({ 'message': 'No register Found!' })
        }

        res.json({ register });

    } catch (error) {
        console.log( error );
        res.status( 500 ).send('There was an error')
    }
}

exports.updateRegister = async( req,res ) => {

    try{
        const { score, watched, watchlist, liked, review } = req.body;
        let register = await Register.findById( req.params.id );
        
        if ( !register ){
            return res.status(404).json({ msg: 'Register not found' });
        }

        if ( register.user.toString() !== req.user.id ){
            return res.status( 401 ).json({ msg: 'Not authorised '});
        }

        const newRegister = {};
        newRegister.score = score;
        newRegister.watched = watched;
        newRegister.watchlist = watchlist;
        newRegister.liked = liked;
        newRegister.review = review;

        register = await Register.findOneAndUpdate({ _id: req.params.id }, newRegister, { new: true });
        res.json({ register });

    } catch( error ){
        console.log ( error );
        res.status( 500 ).send('There was an error');
    }
}

exports.updateLikes = async ( req, res ) => {
    try {
        let register = await Register.findById( req.params.id );
        
        if ( !register ){
            return res.status(404).json({ msg: 'Register not found' });
        }
        
        if( register.user.toString() === req.user.id ){
            return res.status(401).json({ msg: 'No permited. You can liked your review!' });
        }
        
        if( !register.review ) {
            return res.status(401).json({ msg: 'No permited!' });
        }

        if ( register.usersLikes.indexOf( req.user.id ) === - 1) {
            register = await Register.findByIdAndUpdate( req.params.id , { $push: { usersLikes: req.user.id }} )
        } else {
            register = await Register.findByIdAndUpdate( req.params.id , { $pull: { usersLikes: req.user.id }} )
        }
       
        res.json({ register });
        
    } catch (error) {
        console.log ( error );
        res.status( 500 ).send('There was an error');
    }
}

exports.removeRegister = async ( req, res ) => {
    try{
        let register = await Register.findById( req.params.id );

        if( !register ){
            return res.status(404).json({ message: 'Register not found' });
        }

        await Register.findByIdAndDelete( req.params.id );
        res.json({ message: 'Register Removed' });
    }   catch ( error ){
        console.log( error );
        res.status(500).send({ message: 'There was an error '});
    }
}