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
         * @param {number} [maxDecimals=3] 
         * Maximum, not mandatory, decimal places.
         * If -1, simply returns the number as string with no limiting. 
         * Otherwise must be between 0-20, per `toFixed` docs.  
         * @returns {string}
         * @example
         * console.log(toMax(33.333333, 3)); // "33.333"
         * console.log(toMax(33.3, 3));      // "33.3"
         * console.log(toFixed(33.3, 3));    // "33.300"
         */
        toMax(maxDecimals: number): string;

        /** 
         * Clamps a number between the given minimum and maximum values.
         * 
         * By default, clamps between 0 and 1.
         * @param {number} [min = 0] Minimum possible value
         * @param {number} [max = 1] Maximum possible value
         * @returns {number} */
        clamp(min: number = 0, max: number = 1): number;

        /**
         * Checks if this number is between the given minimum and maximum values.
         * @param {number} min Minimum bound value 
         * @param {number} max Maximum bound value 
         * @param {boolean} [inclusive=true] Does exactly matching a bound count as being between? Default `true` 
         * @returns {boolean} */
        isBetween(min: number, max: number, inclusive: boolean = true): boolean;
    }

}

export { };