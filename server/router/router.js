const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');

//express
const router = express.Router();

//dotenv
dotenv.config({path: './config.env'});

//mongoose
require('../db/conn');
const Users = require('../db/model/userSchema');

//endpoint
router.get('/', (req, res)=>{
    res.json({message: 'Home router'});
});

//register page
router.post('/register', async (req, res)=>{
    const {name, email, contact, work, password, cpassword} = req.body;
    try {
        if(!name || !email || !contact || !work || !password || !cpassword){
            res.status(422).json({message: 'Plz fill all the details'});
        }else if(password != cpassword){
            res.status(422).json({message: 'Pass should be same'});
        }else{
            const userExist = await Users.findOne({email: email});
            if(userExist){
                res.status(422).json({message: 'Email already exists'});
            }else{
                const newUser = new Users({name, email, contact, work, password, cpassword});
                const db = await newUser.save();
                if(db){
                    res.json({message: 'Db saved'});
                }else{
                    res.status(422).json({message: 'Db not saved'});
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

//login page
router.post('/signin', async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({message: 'Plz fill all the details'});
        }else{
            const userLogin = await Users.findOne({email: email});
            if(userLogin){
                const userPass = await bcrypt.compare(password, userLogin.password);
                if(userPass){
                    const token = await userLogin.authToken();
                    res.cookie('jwtToken', token, {
                        expire: new Date(Date.now() + 25892000000), httpOnly: true
                    });
                    res.json({message: 'Login successfully'});
                }else{
                    res.status(400).json({message: 'Pass not match'});
                }
            }else{
                res.status(400).json({message: 'Email not match'});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

//about page
router.get('/about', authMiddleware, (req, res)=>{
    res.send(req.rootUser);
;})

//getdata for contact page or home page
router.get('/getdata', authMiddleware, (req, res)=>{
    console.log('getdata');
    res.send(req.rootUser);
});

//contact us page
router.post('/contact', authMiddleware, async (req, res)=>{
    try {
        const { name, email, contact, message } = req.body;
        if(!name || !email || !contact || !message){
            res.status(422).json({message: "Plz fill all details"});
        }else{
            const userContact = await Users.findOne({_id:req.userId});

            if(userContact){
                const userMsg = await userContact.addMsg(name, email, contact, message);
                await userContact.save();
                
                res.status(200).json({message: "User contact saved"});
            }
        }
    } catch (error) {
        
    }
});

// logout page
router.get('/logout', (req, res)=>{
    res.clearCookie('jwtToken', { path: '/' });
    res.status(200).json({message:'Logout successfully'});
})

module.exports = router;