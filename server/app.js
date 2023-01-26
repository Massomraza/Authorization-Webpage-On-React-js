const express = require('express');
const dotenv = require('dotenv');

//express
const app = express();
app.use(express.json());
app.use(require('./router/router'));

//dotenv
dotenv.config({path: './config.env'});
const PORT = process.env.PORT;

//mongoose
require('./db/conn');

//endpoint
app.get('/', (req, res)=>{
    res.status(200).send('home');
});

//server listing
app.listen(PORT, ()=>{
    console.log(`server working fine ${PORT}`);
});