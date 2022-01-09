const connectToMongoose=require('./connectDb');
const express = require('express')
const cors= require('cors')

connectToMongoose();

const app = express();
app.use(express.json());
app.use(cors())
//Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(process.env.PORT,()=>{console.log(`Running successfuly`)})
