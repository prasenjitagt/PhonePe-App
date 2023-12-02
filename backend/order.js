/******** Creating a variable to temporarily store phonepe payment link *******/

let val;


/******** Function by calling which we will store the link from   *******/

export function urlVal(url) {
    val = url;
};

/******** Returning the link when needed *******/

export function retUrl() {
    return val;
}