const mongoose = require('mongoose')

const mongooseURI=process.env.ATLAS

const connectToMongoose =()=>{
    mongoose.connect(mongooseURI,{keepAlive:true},()=>console.log('Connected to mongoDB succesfully'));

}

module.exports =connectToMongoose;