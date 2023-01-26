const mongoose = require('mongoose');
const dotenv = require('dotenv');

//dotenv
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE;

//mongoose
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main(){
    await mongoose.connect(DB);
};