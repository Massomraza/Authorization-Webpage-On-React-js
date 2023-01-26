const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages:[
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            contact: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ],
    tokens: [
        {
            token:{
                type: String,
                required: true
            }
        }
    ]
});

//hashing password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

//token generating
userSchema.methods.authToken = async function(){
    const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token: token});
    await this.save();
    return token;
};

//store msg
userSchema.methods.addMsg = async function(name, email, contact, message){
    try {
        console.log(name, email, contact, message);
        this.messages = await this.messages.concat({name, email, contact, message});
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }
}


const Users = new mongoose.model('Users08', userSchema);

module.exports = Users