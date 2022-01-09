const jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET

fetchuser=(req,res,next)=>{
    // getting user from JWT token
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send("Access denied");
    }
    else{
        try {
            const data=jwt.verify(token,JWT_SECRET);
            req.user=data.user;
            next();
        } catch (error) {
            console.log(error);res.send('Access denied')
        }
    }
    
}
module.exports=fetchuser
