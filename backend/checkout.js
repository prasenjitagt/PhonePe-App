import { currentCart } from 'wix-ecom-backend';
import wixSecretsBackend from 'wix-secrets-backend';

//Website domain name
const domainName = 'https://www.artxgen.com/';
const urlForPostRequest = 'https://www.artxgen.com/_functions/callback';
// const statusLink = 'https://www.artxgen.com/_functions/status';

/********* Axios Setup *********/

const axios = require('axios');

/********* forge Setup *********/

const forge = require('node-forge');

/********* Phonepe API Endpoint *********/
const apiEndPoint = "/pg/v1/pay";


/********* checkout function to interact with phonepe Payment Gateway *********/

export async function checkout() {

    /********* Secret variables to use in phonepe payment request *********/

    /*** UAT Values in Test Variables ***/

    const MID = await wixSecretsBackend.getSecret('UAT_MERCHANT_ID');
    const SALT_KEY = await wixSecretsBackend.getSecret('UAT_KEY');
    const SALT_INDEX = await wixSecretsBackend.getSecret('UAT_KEY_INDEX');


    /*** Production Values in Test Variables ***/

    // const MID = await wixSecretsBackend.getSecret('PROD_MERCHANT_ID');
    // const SALT_KEY = await wixSecretsBackend.getSecret('PROD_KEY');
    // const SALT_INDEX = await wixSecretsBackend.getSecret('PROD_INDEX');

    /*** Test Variables ***/

    // const MID = await wixSecretsBackend.getSecret('MERCHANT_ID');
    // const SALT_KEY = await wixSecretsBackend.getSecret('SALT_KEY');
    // const SALT_INDEX = await wixSecretsBackend.getSecret('SALT_INDEX');

    /********* Getting current cart values of user *********/

    const cart = await currentCart.getCurrentCart();

    /******** Creating Transaction ID *******/
    const transactionID = cart.checkoutId;

    /******** Data for phonepe request *******/

    const data = {
        "merchantId": MID,
        "merchantTransactionId": transactionID,
        "merchantUserId": "MUID123",
        "amount": parseInt(cart.subtotal.convertedAmount) * 100, //amout in paise
        "redirectUrl": domainName,
        "redirectMode": "REDIRECT",
        "callbackUrl": urlForPostRequest,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    //converting data to json payload

    const payload = JSON.stringify(data);

    //converting the payload to Base64

    const payloadBase64 = Buffer.from(payload).toString('base64');

    //SHA256 making
    
    const string = payloadBase64 + apiEndPoint + SALT_KEY;
    const md = forge.md.sha256.create();
    md.update(string);
    const sha256Real = md.digest().toHex();

    //making checksum with sha256
    const checksum = sha256Real + '###' + SALT_INDEX;

    //url for requesting payment

    const HostUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    // const HostUrl ='https://api.phonepe.com/apis/hermes';

    const PayAPIUrl = HostUrl + apiEndPoint;

    //options for sending with the request
    const options = {
        method: 'POST',
        url: PayAPIUrl,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data: {
            request: payloadBase64
        }

    };

    //getting the response after sending the request
    const response = await axios.request(options)
        .then(function (response) {

            return response.data.data.instrumentResponse.redirectInfo.url;
        })
        .catch(function (error) {

           return error
        });

    //return the response to whoever calls the function 'checkout()'
    return response;

}