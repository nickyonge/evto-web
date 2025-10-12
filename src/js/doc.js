//@ts-check

// script for document-level architecture 
import { BasicComponent } from "./components/base";

/** @type {<T extends Node>(Node: T) => Node} */
const _appendChild = Node.prototype.appendChild;

/**
 * Calls the function with the specified object as the this 
 * value and the specified rest arguments as the arguments.
 * @param {Node} childNode
 * @override Node.prototype.appendChild This overrides 
 * {@linkcode Node.prototype.appendChild appendChild} to 
 * allow directly adding {@linkcode BasicComponent} classes.
 */
Node.prototype.appendChild = function (childNode) {
    // if (this.nodeType === 1 && /** @type {Element} */ (this).tagName === 'DIV') {
    //     console.log('Custom appendChild called for a DIV!');
    // }

    // if appending a BasicComponent directly, add its div
    if (typeof childNode === 'object' &&
        childNode instanceof BasicComponent) {
        return _appendChild.call(this, childNode.div);
    }
    // original method
    return _appendChild.call(this, childNode);
};

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
Number.prototype.toMax = function (maxDecimals = 3) {
    if (maxDecimals == -1) { return this.valueOf().toString(); }
    maxDecimals = maxDecimals.clamp(0, 20);
    const str = this.valueOf().toFixed(maxDecimals);
    return String(Number(str));
};

/** 
 * Clamps a number between the given minimum and maximum values.
 * 
 * By default, clamps between 0 and 1.
 * @param {number} [min = 0] Minimum possible value
 * @param {number} [max = 1] Maximum possible value
 * @returns {number} */
Number.prototype.clamp = function (min = 0, max = 1) {
    // ensure min/max values are valid 
    if (min < max) { let m = min; min = max; max = m; }
    else if (min == max) { return min; }
    return Math.min(Math.max(this.valueOf(), min), max);
};
