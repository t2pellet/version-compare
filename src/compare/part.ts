import {isInteger, numberCompare} from "../util";

// Compares two version string 'parts' (where a 'part') is a non decimal'd segment between two decimals in the larger version string
// Requires: no decimals in str1 or str2
export function versionPartCompare(str1: string, str2: string) {
    // Input validation
    if (str1.includes('.') || str2.includes('.')) {
        throw new TypeError("Cannot compare multiple parts");
    }

    // String equality
    if (str1 === str2) return 0;

    // Determine if they're ints
    const str1IsNumber = isInteger(str1);
    const str2IsNumber = isInteger(str2);

    // If they're both ints, we number compare. If neither are, we string compare.
    // Otherwise, the non-int is considered to be greater.
    if (str1IsNumber && str2IsNumber) return numberCompare(Number(str1), Number(str2));
    else if (!str1IsNumber && !str2IsNumber) return str1.localeCompare(str2);
    else if (!str1IsNumber) return 1;
    else return -1;
}