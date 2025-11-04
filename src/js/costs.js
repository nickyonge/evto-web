// [ [ [ [  [  [   [ TOKEN COST VALUES ]   ]  ]  ] ] ] ]

import { currentSize, Size } from "./contentData";

// ============= SIZING ===============================

export const SIZE_SM = 0;  // small  
export const SIZE_SMP = 1; // small plus
export const SIZE_MD = 2;  // medium 
export const SIZE_MDP = 10; // medium plus 
export const SIZE_LG = 11;  // large 
export const SIZE_LGP = 12; // large plus

export const SIZE_CANVAS = [
    [SIZE_SM, SIZE_SMP, SIZE_MD, SIZE_MDP, SIZE_LG, SIZE_LGP],
    [SIZE_SM, SIZE_SMP, SIZE_MD, SIZE_MDP, SIZE_LG, SIZE_LGP],
    [SIZE_SM, SIZE_SMP, SIZE_MD, SIZE_MDP, SIZE_LG, SIZE_LGP]
]; // use same for all sizes, because these ARE the size cost changes 

// ============= FEATURES =============================

export const FEAT_LANDDETAIL = [
    [0, 0, 0], // small
    [1, 2, 3], // med
    [3, 4, 5]  // large
];
export const FEAT_GCSLINES = [
    [0, 0, 0], // small
    [1, 2, 3], // med
    [3, 4, 5]  // large
];
export const FEAT_LABELLING = [
    [0, 0, 0], // small
    [1, 2, 3], // med
    [3, 4, 5]  // large
];
export const FEAT_TITLEBOX = [
    [0, 0, 0], // small
    [1, 2, 3], // med
    [3, 4, 5]  // large
];
export const FEAT_LANDLINES = [
    [0, 0, 0, 0, 0], // small
    [1, 2, 3, 4, 5], // med
    [6, 7, 8, 9, 10]  // large
];
export const FEAT_LANGUAGE = [
    [0, 0, 0], // small
    [1, 2, 3], // med
    [3, 4, 5]  // large
];

// ============= COLOUR & PATTERN =====================





// ============= GETTER LOGIC =========================

/**
 * Gets the cost value of the given costValues group, using {@link currentSize}, and for the given index
 * @param {number|Array<number>|Array<Array<number>>} costValues Cost, or array of costs per size, 
 * or array of array of costs per size per index value (eg Sm/Md/Lg + Low/Med/High Detail) 
 * @param {number} index Index into the size array to read 
 * @returns {number} Given cost value, or -1 if invalid / error
 */
export function GetCost(costValues, index) {
    return GetCostForSize(costValues, currentSize, index);
}
/**
 * Gets the cost value of the given costValues group, for the given size and index
 * @param {number|Array<number>|Array<Array<number>>} costValues Cost, or array of costs per size, 
 * or array of array of costs per size per index value (eg Sm/Md/Lg + Low/Med/High Detail) 
 * @param {Size} size Canvas size cost value
 * @param {number} index Index into the size array to read 
 * @returns {number} Given cost value, or -1 if invalid / error
 */
export function GetCostForSize(costValues, size, index) {
    // determine cost value types 
    switch (typeof costValues) {
        case 'number':
            // just a number, return it 
            return costValues;
        case 'object':
            // check if an array:
            if (Array.isArray(costValues)) {
                // yup, it's an array - is it an array of arrays?
                if (costValues.length == 0) {
                    console.warn(`WARNING: costValues array is empty, can't get cost value, returning -1`);
                    return -1;
                }
                if (size == null) {
                    if (index == null) {
                        // no size nor index
                        console.warn(`WARNING: costValues size and index are null, returning first found value in costVales ${costValues}`);
                        if (Array.isArray(costValues[0]))
                            return costValues[0][0];
                        return costValues[0];
                    } else {
                        // index, no size, ensure not 2d array
                        if (Array.isArray(costValues[0])) {
                            console.warn(`WARNING: costValues ${costValues} is 2D array but only index ${index} provided, size null, returning costValues[0][Math.min(costValues.length - 1, index)]`);
                            return costValues[0][Math.min(costValues.length - 1, index)];
                        }
                        // 1d array, presume that size doesn't matter
                        return costValues.flat[Math.min(costValues.length - 1, index)];
                    }
                } else {
                    if (index == null) {
                        // size, no index, ensure not 2d array
                        if (Array.isArray(costValues[0])) {
                            console.warn(`WARNING: costValues ${costValues} is 2D array but only size ${size} provided, index null, returning costValues[size][0]`);
                            return costValues[size][0];
                        }
                        // 1d array, presume that index doesn't matter 
                        return costValues.flat[size];
                    } else {
                        // size and index
                        let s = Math.min(costValues.length - 1, size);
                        if (Array.isArray(costValues[s])) {
                            let i = Math.min(costValues[s].length - 1, index);
                            return costValues[s][i];
                        }
                        return costValues.flat[s];
                    }
                }
            }
            break;
    }
    console.warn(`WARNING: invalid type ${typeof costValues} for costValues ${costValues}, ` +
        `can't process cost value, size: ${size}, index: ${index}, returning -1`);
    return -1;
}

/**
 * Gets the cost value of the given costValues group, using {@link currentSize}, as an array of values for that size
 * @param {number|Array<number>|Array<Array<number>>} costValues Cost, or array of costs per size, 
 * or array of array of costs per size per index value (eg Sm/Md/Lg + Low/Med/High Detail) 
 * @returns {Array<number>|null} Given cost value array, or null if invalid / error
 */
export function GetCostArray(costValues) {
    return GetCostArrayForSize(costValues, currentSize);
}
/**
 * Gets the cost value of the given costValues group, for the given size, as an array of values for given size
 * @param {number|Array<number>|Array<Array<number>>} costValues Cost, or array of costs per size, 
 * or array of array of costs per size per index value (eg Sm/Md/Lg + Low/Med/High Detail) 
 * @param {Size} size Canvas size cost value
 * @returns {number[]|null} Given cost value array, or null if invalid / error
 */
export function GetCostArrayForSize(costValues, size) {
    // nullchecks 
    if (costValues == null || costValues == undefined) {
        return null;
    }
    // determine cost value types 
    switch (typeof costValues) {
        case 'number':
            // just a number, return it 
            return [costValues];
        case 'object':
            // check if an array:
            if (Array.isArray(costValues)) {
                // yup, it's an array - is it valid?
                if (costValues.length == 0) {
                    console.warn(`WARNING: costValues array is empty, can't get cost value, returning []`);
                    return [];
                }
                // is size valid?
                if (size == null) {
                    // no size
                    console.warn(`WARNING: size is null, returning costValues[0] (${costValues[0]}) array in costValues ${costValues}`);
                    return costValues.flat[0];
                } else {
                    if (Array.isArray(costValues[0])) {
                        return /** @type {number[]} */ (costValues[size]);
                    }
                    return /** @type {number[]} */ (costValues);
                }
            }
            break;
    }
    console.warn(`WARNING: invalid type ${typeof costValues} for costValues ${costValues}, ` +
        `can't process cost value as array, size: ${size}, returning null`);
    return null;
}
