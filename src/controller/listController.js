const ListItems = require('../models/ListItems');

exports.createList = async ( req, res ) => {
    try{
        const list = new ListItems( req.body );
        list.user = req.user.id;
        await list.save();
        res.json({ list });
    } catch( error ){
        console.log( error );
        res.status( 500 ).send('There was an error');
    }
}

exports.modifyList = async ( req, res ) => {
    try{
        let list = await ListItems.findById( req.params.id );
        const listModified = req.body;

        if( !list ){
            return res.status(404).json({ 'message': 'List not found' });
        }
        
        if( list.user.toString() !== req.user.id ){
            return res.status(401).json({ 'message': 'Not authorized' });
        }

        list = await ListItems.findByIdAndUpdate( list._id, listModified, { new: true } );
        
        res.json({ list });

    } catch ( error ){
        console.log( error );
        res.status( 500 ).send('There was an error');
    }
}

exports.deleteList = async ( req, res ) => {
    try{
        const list = await ListItems.findById( req.params.id );

        if( !list ){
            return res.status(404).json({ 'message': 'List not found' });
        }
        
        if( list.user.toString() !== req.user.id ){
            return res.status(401).json({ 'message': 'Not authorized' });
        }
        
        await ListItems.findByIdAndDelete( list._id );
        
        res.json({ 'message' : 'List deleted' });

    } catch ( error ){
        console.log( error );
        res.status( 500 ).send('There was an error');
    }
}