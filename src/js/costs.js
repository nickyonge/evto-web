// [ [ [ [  [  [   [ TOKEN COST VALUES ]   ]  ]  ] ] ] ]

import { currentSize, Size } from "./contentData";

// ============= SIZING ===============================

export const SIZE_CANVAS = [
    [0, 1], // small, small plus
    [2, 3], // meduim, med plus 
    [4, 5]  // large, large plus 
];

export const SIZE_SM = 0;
export const SIZE_SMP = 1;
export const SIZE_MD = 2;
export const SIZE_MDP = 3;
export const SIZE_LG = 4;
export const SIZE_LGP = 5;

// ============= FEATURES =============================

//TODO: make these accommodate cost differences in sm/md/lg 
export const FEAT_LANDDETAIL = [
    [0, 0, 0],
    [1, 2, 3],
    [3, 4, 5]
];
export const FEAT_GCSLINES = [];
export const FEAT_LABELLING = [];
export const FEAT_TITLEBOX = [];
export const FEAT_LANDLINES = [];
export const FEAT_LANGUAGE = [];

// ============= COLOUR & PATTERN =====================

/**
 * Gets the cost value of the given costValues group, using {@link currentSize}, and for the given index
 * @param {number|Array<number>|Array<Array<number>>} costValues Cost, or array of costs per size, 
 * or array of array of costs per size per index value (eg Sm/Md/Lg + Low/Med/High Detail) 
 * @param {Size} size Canvas size cost value
 * @param {number} index Index into the size array to read 
 * @returns {number} Given cost value, or -1 if invalid / error
 */
export function GetCost(costValues, index) {
    return GetCostForSize(costValues, currentSize, index);
}

export function GetCostArray(costValues) {
    return GetCostArrayForSize(costValues, currentSize);
}

export function GetCostArrayForSize(costValues, size) {
    // determine cost value types 
    switch (typeof costValues) {
        case 'number':
            // just a number, return it 
            return [costValues];
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
                        return costValues[Math.min(costValues.length - 1, index)];
                    }
                } else {
                    if (index == null) {
                        // size, no index, ensure not 2d array
                        if (Array.isArray(costValues[0])) {
                            console.warn(`WARNING: costValues ${costValues} is 2D array but only size ${size} provided, index null, returning costValues[size][0]`);
                            return costValues[size][0];
                        }
                        // 1d array, presume that index doesn't matter 
                        return costValues[size];
                    } else {
                        // size and index
                        let s = Math.min(costValues.length - 1, size);
                        if (Array.isArray(costValues[s])) {
                            let i = Math.min(costValues[s].length - 1, index);
                            return costValues[s][i];
                        }
                        return costValues[s];
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
                        return costValues[Math.min(costValues.length - 1, index)];
                    }
                } else {
                    if (index == null) {
                        // size, no index, ensure not 2d array
                        if (Array.isArray(costValues[0])) {
                            console.warn(`WARNING: costValues ${costValues} is 2D array but only size ${size} provided, index null, returning costValues[size][0]`);
                            return costValues[size][0];
                        }
                        // 1d array, presume that index doesn't matter 
                        return costValues[size];
                    } else {
                        // size and index
                        let s = Math.min(costValues.length - 1, size);
                        if (Array.isArray(costValues[s])) {
                            let i = Math.min(costValues[s].length - 1, index);
                            return costValues[s][i];
                        }
                        return costValues[s];
                    }
                }
            }
            break;
    }
    console.warn(`WARNING: invalid type ${typeof costValues} for costValues ${costValues}, ` +
        `can't process cost value, size: ${size}, index: ${index}, returning -1`);
    return -1;
}