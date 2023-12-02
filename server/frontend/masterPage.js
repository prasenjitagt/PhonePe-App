import { checkout } from 'backend/checkout'
import wixLocationFrontend from 'wix-location-frontend';
import {urlVal,retUrl} from 'backend/order'

$w.onReady(async function () {

    /******** Storing the cart url in checkout page *******/
    if (wixLocationFrontend.path[0] === 'checkout') {
        const url = await checkout();

        //Sending the payment link to order.jsw
        await urlVal(url);
    }
	

     /******** Creating Transaction ID *******/
	if (wixLocationFrontend.path[0] === 'thank-you-page') {

        //Getting the payment link from order.jsw
        const uri = retUrl();
        
        //Since uri is a promise, so resolving promise to get the link
        uri.then(link => {

        //redirecting to that link            
        wixLocationFrontend.to(link);
            
        })
    }


});