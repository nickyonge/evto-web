declare global {
    interface Number {
        /** 
         * Converts the given number to string to the given max number of decimals, 
         * while (unlike `toFixed`) also removing any trailing zeros.
         * @param {number} num Number to convert to string
         * @param {number} [maxDecimals=3] Maximum, not mandatory, decimal places  
         * @returns {string}
         * @example
         * console.log(toMax(33.333333, 3)); // "33.333"
         * console.log(toMax(33.3, 3));      // "33.3"
         * console.log(toFixed(33.3, 3));    // "33.300"
         */
        toMax(maxDecimals?: number): string;
    }
}

export { };