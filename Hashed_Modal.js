const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Hash=new Schema({
    Username:{
        type:String,
        required:true
    },
    HashedPassword:{
        type:String,
        required:true
    },
    Random:{
        type:Number,
        required:true,
    },
    HashDecider:{
        type:String,
        required:true,
    },
    Decoder:{
        type:String,
        required:true
    }
});

const Hashed=mongoose.model('Hashed',Hash);

module.exports=Hashed;
