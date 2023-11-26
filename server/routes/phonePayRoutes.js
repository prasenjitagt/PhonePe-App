/********* Express Router Setup *********/
const express = require('express');
const router = express.Router();

/********* Crpyto and Axios Setup *********/

const crypto = require("crypto");
const axios= require("axios");

/********* Environmet Variable Setup *********/
require('dotenv').config();
const secret = process.env;


/********* Transaction ID maker *********/

const generateTransactionId = () =>{

    const time =  Date.now();
    const randomNum =  Math.floor(Math.random()*1000000);
    const merchantPrefix = "T";

    //generating transaction id
    const transactionId= `${merchantPrefix}${time}${randomNum}`;

    //returning transaction id
    
    return transactionId;
}




/********* Initial route *********/

router.get('/',(req,res)=>res.send('Hi I am on again'));





/********* 2nd route *********/

router.get('/test',(req,res)=>res.send('Test successful'))






/********* Payment route *********/

router.post('/pay',async (req,res)=>{
    try {


        const data = {
            "merchantId": secret.MERCHANT_ID,
            "merchantTransactionId": generateTransactionId(),
            "merchantUserId": "MUID123",
            "amount": 10000,
            "redirectUrl": "http://localhost:8080/test",
            "redirectMode": "REDIRECT",
            "callbackUrl": "http://localhost:8080/test",
            "mobileNumber": "9999999999",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }



    //converting data to json payload

    const payload = JSON.stringify(data);

    //converting the payload to Base64

    const payloadBase64 = Buffer.from(payload).toString('base64');


    //SHA256 making
    const sha256Link = "/pg/v1/pay";
    const string = payloadBase64 + sha256Link + secret.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');

    //making checksum with sha256
    const checksum = sha256 + '###' + secret.SALT_INDEX;
    
    const URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    const options = {
        method: 'POST',
        url: URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY' : checksum
        },
        data:{
            request:payloadBase64
        }
        
    };
    
    axios.request(options)
    .then(function (response) {
       console.log(response.data.data.instrumentResponse.redirectInfo.url);
       return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);

        // return res.status(200).send(response.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
        console.error(error);
    });
    





    } catch (error) {
    
        res.status(500).send({
            message:error.message,
            success:false

        })

    }
});


/********* Redirect URL *********/



/********* Exporting Router *********/
 
 module.exports = router;