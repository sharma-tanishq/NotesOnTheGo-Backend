const mongoose=require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    
    title: {
        type:String, 
        required:true
    },
    description: {
        type:String, 
    },
    tag: {
        type:String, 
        default:"General"
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('notes', NoteSchema);