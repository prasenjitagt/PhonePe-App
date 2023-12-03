import { ok } from 'wix-http-functions';

export async function post_callback(request) {

    // Parse the JSON data from the request body
    const data = await request.body.json();

    //decoding the response which is in base64 from data object
    const decodedString = Buffer.from(data.response,'base64').toString('ascii');
    console.log(decodedString);

}