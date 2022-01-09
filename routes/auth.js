const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser=require('../middleware/fetchuser');

const JWT_SECRET = process.env.SECRET



router.post('/createuser', body('name').isLength({ min: 5 }), body('email').isEmail(), async (req, res) => {
    const error = validationResult(req);
    let success =false;
    if (!error.isEmpty()) {
        return res.status(400).json({ success:success,error: error.array() });
    }
    try {
        //checking for duplicate email
        {
            let user = await User.findOne({ email: req.body.email.toLowerCase() })
            if (user) {
                console.log("This email already signed up please log in"); return res.status(400).json({success:success,message:"This email already signed up please log in"});
            }
        }
        //checking for duplicate username
        {
            let user = await User.findOne({ username: req.body.username })
            if (user) {
                console.log("This username is already in use please use another"); return res.status(400).send({success:success,message:"This username is already in use please use another"});
            }
        }
        const salt = await bcryptjs.genSalt();
        const hashedPass = await bcryptjs.hash(req.body.password, salt);
        //creating user
        const user = await User.create({
            name: req.body.name,
            password: hashedPass,
            email: req.body.email.toLowerCase(),
            username: req.body.username,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken=  jwt.sign(data,JWT_SECRET);
        if(authToken)success=true;
        res.json({success,authToken});
    } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});

//authentication using login. NO login requires

router.post('/login', body('email','Please enter correct credentials').isEmail().exists(), body('password', 'password cannot be blank').exists(), async (req, res) => {
    const error = validationResult(req);
    let success=false;
    if (!error.isEmpty()) {
        return res.status(400).json({ success:success,error: error.array() });
    }
    try {

        //extracting email pass from request
        const { username, email, password } = req.body;

        //finding user using username
        const user = await User.findOne({ username:username })
        if (!user) { return res.status(400).json({success:success,message:'Please enter correct credentials or click forgot password'}) }

        //checking if email is correct
        if (email !== user.email) { return res.status(400).json({success:success,message:'Please enter correct credentials or click forgot password'}) }

        //comparing password
        const passwordCompare = await bcryptjs.compare(password, user.password)
        if (!passwordCompare) { return res.status(400).json({success:success,message:'Please enter correct credentials or click forgot password'}) }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        if(authToken)success=true;
        res.json({success,authToken});
        console.log(authToken);

    } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});

//getting userdata login required

router.post('/getuser',fetchuser, async (req, res) => {
    let success = false;
    try {

      const userid=req.user.id
      const user= await User.findById(userid);
      if(user){success=true;return res.json({success,user});}
      else res.status(401).json({success:success,message:"User not found"})
    } catch (error) { console.error(error.message); res.status(500).json({success:success,message:"Internal Server Error"}) }
});

module.exports = router;