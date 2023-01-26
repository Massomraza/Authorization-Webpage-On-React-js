const jwt = require('jsonwebtoken');
const User = require('../db/model/userSchema');

const authMiddleware = async (req, res, next)=>{
    try {
        const token = req.headers.cookie;
        const tokenR = token.replace('jwtToken=','');
        const verify = jwt.verify(tokenR, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id: verify._id, "tokens.token": tokenR});

        if(!rootUser) {throw new Error('User not found')}
        // console.log(rootUser);
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        
        next();
    } catch (error) {
        res.status(401).send('Unauthorized: No token provided');
        console.log(error);
        
    }
};

module.exports = authMiddleware;