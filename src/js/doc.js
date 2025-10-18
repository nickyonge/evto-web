//@ts-check
// script for document-level architecture

// #region Node 

import { BasicComponent } from "./components/base";

/** 
 * The `appendChild()` method of the Node interface adds a node to the end of the list of children of a specified parent node. 
 * @type {<T extends Node>(Node: T) => Node} 
 */
const _appendChild = Node.prototype.appendChild;

/**
 * Calls the function with the specified object as the this 
 * value and the specified rest arguments as the arguments.
 * @param {Node} childNode
 * @override This overrides 
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

// #endregion Node

// #region Array

// all mutating functions for an array

/**
 * Returns this array after copying a section of the array identified by start and end
 * to the same array starting at position target
 * @param {Number} target If target is negative, it is treated as length+target where length is the
 * length of the array.
 * @param {Number} start If start is negative, it is treated as length+start. If end is negative, it
 * is treated as length+end.
 * @param {Number} [end=this.length] If not specified, length of the this object is used as its default value.
 * @returns {T[]} This array, after modification
 * @type {(target: number, start: number, end?: number) => T[]} 
 * @template T 
 */
const _copyWithin = Array.prototype.copyWithin;
/**
 * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
 * @param {T} value value to fill array section with
 * @param {Number} [start=0] index to start filling the array at. If start is negative, it is treated as
 * length+start where length is the length of the array. If undefined, 0 is used.
 * @param {Number=} end index to stop filling the array at. If end is negative, it is treated as
 * length+end. If undefined, array.length is used.
 * @returns {T[]} The modified array
 * @type {<T>(value: T, start?: number, end?: number) => T[]}
 * @template T 
 */
const _fill = Array.prototype.fill;
/**
 * Removes the last element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T | undefined} The now-removed last element of the array (or `undefined`)
 * @type {<T>() => T | undefined}
 * @template T 
 */
const _pop = Array.prototype.pop;
/**
 * Appends new elements to the end of an array, and returns the new length of the array.
 * @param {...T} items New elements to add to the array.
 * @returns {Number} The new length of the array 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
const _push = Array.prototype.push;
/**
 * Reverses the elements in an array in place.
 * This method mutates the array and returns a reference to the same array.
 * @returns {T[]} Returns a reference to this same, now reversed, array 
 * @type {<T>() => T[]}
 * @template T 
 */
const _reverse = Array.prototype.reverse;
/**
 * Removes the first element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T[] | undefined} The now-removed first element of the array (or `undefined`)
 * @type {<T>() => T[] | undefined}
 * @template T 
 */
const _shift = Array.prototype.shift;
/**
 * Sorts an array in place.
 * This method mutates the array and returns a reference to the same array.
 * @param {(a: T, b: T) => number} compareFn Function used to determine the order of the elements. It is expected to return
 * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
 * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
 * ```ts
 * [11,2,22,1].sort((a, b) => a - b)
 * ```
 * @returns {Array<T>} Reference to this array object 
 * @type {<T>(compareFn?: (a: T, b: T) => number) => T[]}
 * @template T 
 */
const _sort = Array.prototype.sort;
/**
 * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
 * @param {Number} start The zero-based location in the array from which to start removing elements.
 * @param {Number} [deleteCount=0] The number of elements to remove. Omitting this argument will remove all elements from the start
 * paramater location to end of the array. If value of this argument is either a negative number, zero, undefined, or a type
 * that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
 * @param {...T=} items Optional elements to add to the array. If omitted, will only remove elements from the array.
 * @returns {T[]} An array containing the elements that were deleted, including `[]` if nothing was deleted.
 * @type {<T>(start: number, deleteCount?: number, ...items: T[]) => T[]}
 * @template T 
 */
const _splice = Array.prototype.splice;
/**
 * Inserts new elements at the start of an array, and returns the new length of the array.
 * @type {<T>(...items: T[]) => number}
 * @param {...T} items Elements to insert at the start of the array.
 * @returns {Number} The new length of the array.
 * @template T 
 */
const _unshift = Array.prototype.unshift;

Array.prototype.copyWithin = function (target,start,end = undefined) {
    return _copyWithin.call(this, target, start, end);
};

/**
 * Appends new elements to the end of an array, and returns the new length of the array.
 * @param {...T} items New elements to add to the array.
 * @returns {Number} The new length of the array 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
Array.prototype.push = function (...items) {
    if (this.hasOwnProperty('onChange')) {
        let v = _push.call(this, ...items);
        //@ts-ignore
        this.onChange('push', v, this);
        return v;
    }
    return _push.call(this, ...items);
}

// #endregion Array 

// #region Number 

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
    if (min > max) { let m = min; min = max; max = m; }
    else if (min == max) { return min; }
    return Math.min(Math.max(this.valueOf(), min), max);
};

/**
 * Checks if this number is between the given minimum and maximum values.
 * @param {number} min Minimum bound value 
 * @param {number} max Maximum bound value 
 * @param {boolean} [inclusive=true] Does exactly matching a bound count as being between? Default `true` 
 * @returns {boolean} */
Number.prototype.isBetween = function (min, max, inclusive = true) {
    return inclusive ?
        this.valueOf() >= min && this.valueOf() <= max :
        this.valueOf() > min && this.valueOf() < max;
};

/**
 * Checks if this number is even, returning `true`, or odd, returning `false`
 * @see {@link Number.isOdd isOdd}
 * @returns {boolean} */
Number.prototype.isEven = function () {
    if (!Number.isFinite(this.valueOf())) {
        throw new Error(`ERROR: value ${this.valueOf()} is not finite, cannot determine if even/odd`);
    }
    return this.valueOf() % 2 == 0;
}
/**
 * Checks if this number is odd, returning `true`, or even, returning `false`
 * @see {@link Number.isEven isEven}
 * @returns {boolean} */
Number.prototype.isOdd = function () { return !this.valueOf().isEven; }

// #endregion Number 
