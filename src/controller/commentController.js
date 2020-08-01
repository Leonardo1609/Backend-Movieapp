const User       = require('../models/User');
const Register   = require('../models/Register');
const Commentary = require('../models/Comment');

exports.postComment = async ( req, res ) => {
    try {
        const register = await Register.findById( req.params.id );
        const { text } = req.body;
        
        if ( !register ){
            return res.status( 404 ).json({ 'message' : 'Register not found!' });
        }
        
        if( !register.review ){
            return res.status( 404 ).json({ 'message' : 'Invalid Action!' });
        }

        const comment = new Commentary({ text, user : req.user.id, register : req.params.id });
        await comment.save();

        res.json({ comment });
    } catch (error) {
        console.log( error );
        return res.status( 500 ).send('There was an error');
    }
}

exports.editComment = async ( req, res ) => {

    try {
        const { text } = req.body;
        const comment = await Commentary.findById( req.params.id ); 

        if ( !comment ){
            return res.status( 404 ).json({ 'message' : 'Comment not found!' });
        }
        
        if ( comment.user.toString() !== req.user.id ){
            return res.status( 404 ).json({ 'message' : 'No authorized!' });
        } 

        comment.text = text;
        await comment.save();

        res.json({ comment });
    } catch (error) {
        console.log( error );
        return res.status( 500 ).send('There was an error');
    }
}

exports.deleteComment = async ( req, res ) => {
    try {
        const register = await Register.findById( req.params.registId );
        const comment = await Commentary.findById( req.params.id )
        
        if ( !comment ){
            return res.status( 404 ).json({ 'message' : 'Comment not found!' });
        }
        
        if ( comment.user.toString() === req.user.id || register.user.toString() === req.user.id ){
            await Commentary.findByIdAndDelete( comment._id );
            res.json({ 'message' : 'Comment deleted!' });
        } else{
            return res.status( 404 ).json({ 'message' : 'Invalid Action!' });
        }

    } catch (error) {
        console.log( error );
        return res.status( 500 ).send('There was an error');
    }
}

exports.getComments = async( req, res ) => {
    try {
        const register = await Register.findById( req.params.id );
        if( !register ){
            return res.status( 404 ).json({ 'message': 'Register not found' });
        }

        const comments = await Commentary.find({ register: register._id });
        
        // I want to send the commend and the username and image of the user
        const comments_to_send = await Promise.all( comments.map( async comment => {
            return { comment, user: await User.findById( comment.user ).select('username image') }
        }) );

        res.json({ comments: comments_to_send });

    } catch (error) {
        console.log( error );
        return res.status( 500 ).send('There was an error');
    }
}