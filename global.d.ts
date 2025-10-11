import type { BasicComponent } from "./src/js/components/base";

declare global {

    interface Node {
        /**
         * Calls the function with the specified object as the this 
         * value and the specified rest arguments as the arguments.
         * @param thisArg The object to be used as the this object.
         * @param args Argument values to be passed to the function.
         * @augments Node.prototype.appendChild This augments 
         * {@linkcode Node.prototype.appendChild appendChild} to 
         * allow directly adding {@linkcode BasicComponent} classes.
         */
        appendChild<T extends Node>(Node: T): Node;
    }

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
        toMax(maxDecimals: number): string;
    }
    
}

export { };