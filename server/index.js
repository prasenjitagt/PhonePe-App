

/********* Express Setup *********/
const express = require('express');
const app = express();
app.use(express.json());

/********* Middleware Setup *********/

const cors = require('cors');
app.use(cors());

/********* Environmet Variable Setup *********/
require('dotenv').config();
const secret = process.env;




/********* Page Route Setup *********/
const pageRouter = require('./routes/phonePayRoutes')
app.use(pageRouter);











/********* Port and Server Setup *********/
const port = 5000;
app.listen(process.env.PORT || port,()=>{
    console.log(`Server on port ${process.env.PORT||port}`);
})




