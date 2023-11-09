import {versionPartCompare} from "./part";

const VERSION_REGEX = /^[\w\s]+(\.[\w\s]+)*$/
const ZEROS_REGEX = /^0+(\.0+)*$/

// Compares two version strings
// Designed to be pretty flexible since the question gives no specification on input format
function versionCompare(str1: string, str2: string): number {
    // Trim first
    const v1 = str1.trim();
    const v2 = str2.trim();

    // Input validation
    if (!VERSION_REGEX.test(v1)) {
        throw new TypeError("Invalid version string v1: " + v1);
    } else if (!VERSION_REGEX.test(v2)) {
        throw new TypeError("Invalid version string v2: " + v2);
    }

    // Check string equality first
    if (v1 === v2) return 0;

    // Split into array
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');
    // We check iteratively up to the end of the shorter version str
    const shortestLength = Math.min(v1Parts.length, v2Parts.length);
    for (let i = 0; i < shortestLength; ++i) {
        const v1Part = v1Parts[i];
        const v2Part = v2Parts[i];
        const result = versionPartCompare(v1Part, v2Part);
        // First time parts are ne from L->R we're done
        if (result != 0) return result;
    }
    // If we're here, we know we have one longer string
    const longerStr = v1Parts.length > v2Parts.length ? v1 : v2;
    // Calculate the remaining portion of the longer string
    const longerStrCutoff = longerStr.split('.', shortestLength).join('.').length;
    const remainingStr = longerStr.slice(longerStrCutoff + 1);;
    // If the remaining portion is just zeroes they're still equal
    if (ZEROS_REGEX.test(remainingStr)) return 0;
    // Otherwise the longer one is greater
    return Math.sign(v1Parts.length - v2Parts.length);
}

export default versionCompare;