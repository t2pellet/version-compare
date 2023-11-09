// Util function to compare two numberrs
function numberCompare(n1: number, n2: number) {
    const diff = n1 - n2;
    return Math.sign(diff);
}

const INT_REGEX = /^\d+$/
// Util function to check if a string is an integer via regexp above
function isInteger(str: string) {
    return INT_REGEX.test(str);
}

export {
    isInteger,
    numberCompare
}