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

/** unique symbol for arrayName internal property */
const _arrayName = Symbol('arrayName');
Object.defineProperty(Array.prototype, 'name', {
    /** 
     * Optionally-assigned name for this array
     * @returns {string} */
    get: function () { return this[_arrayName] || undefined; },
    /**
     * Optionally-assigned name for this array
     * @param {string|undefined} [name=undefined] Name to assign to this array. Default `undefined`
     * @returns {void} */
    set: function (name) {
        if (name === null || name === undefined) {
            // null and undefined are acceptable 
        } else {
            if (typeof name !== 'string') {
                throw new TypeError('Array name must be string, null, or undefined')
            }
        }
        if (this[_arrayName] === name) { return; } // don't change if new name is identical 
        if (this.hasOwnProperty('onChange')) {
            let prev = this[_arrayName];
            const a = /** @type {Array} */ (this);
            a.onChange('name', a, name, prev);
        }
        this[_arrayName] = name;
    },
    configurable: true,
    enumerable: true,
});

// all mutating functions for an array: 
// copyWithin, fill, pop, push, reverse, shift, sort, splice, unshift

/**
 * Returns this array after copying a section of the array identified by start and end
 * to the same array starting at position target
 * @param {Number} target If target is negative, it is treated as length+target where length is the
 * length of the array.
 * @param {Number} start If start is negative, it is treated as length+start. If end is negative, it
 * is treated as length+end.
 * @param {Number} [end=this.length] If not specified, length of the this object is used as its default value.
 * @returns {T[]} This array, after modification
 * @override This overrides {@linkcode Array.prototype.copyWithin copyWithin} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {(target: number, start: number, end?: number) => T[]} 
 * @template T 
 */
const _copyWithin = Array.prototype.copyWithin;
/**
 * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
 * @param {T} value value to fill array section with
 * @param {Number} [start=0] index to start filling the array at. If start is negative, it is treated as
 * length+start where length is the length of the array. If undefined, 0 is used.
 * @param {Number} [end=this.length] index to stop filling the array at. If end is negative, it is treated as
 * length+end. If undefined, array.length is used.
 * @returns {T[]} The modified array
 * @override This overrides {@linkcode Array.prototype.fill fill} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(value: T, start?: number, end?: number) => T[]}
 * @template T 
 */
const _fill = Array.prototype.fill;
/**
 * Removes the last element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T | undefined} The now-removed last element of the array (or `undefined`)
 * @override This overrides {@linkcode Array.prototype.pop pop} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>() => T | undefined}
 * @template T 
 */
const _pop = Array.prototype.pop;
/**
 * Appends new elements to the end of an array, and returns the new length of the array.
 * @param {...T} items New elements to add to the array.
 * @returns {Number} The new length of the array 
 * @override This overrides {@linkcode Array.prototype.push push} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
const _push = Array.prototype.push;
/**
 * Reverses the elements in an array in place.
 * This method mutates the array and returns a reference to the same array.
 * @returns {T[]} Returns a reference to this same, now reversed, array 
 * @override This overrides {@linkcode Array.prototype.reverse reverse} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>() => T[]}
 * @template T 
 */
const _reverse = Array.prototype.reverse;
/**
 * Removes the first element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T[] | undefined} The now-removed first element of the array (or `undefined`)
 * @override This overrides {@linkcode Array.prototype.shift shift} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
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
 * @override This overrides {@linkcode Array.prototype.sort sort} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
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
 * @param {...T} [items=undefined] Optional elements to add to the array. If omitted, will only remove elements from the array.
 * @returns {T[]} An array containing the elements that were deleted, including `[]` if nothing was deleted.
 * @override This overrides {@linkcode Array.prototype.splice splice} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(start: number, deleteCount?: number, ...items: T[]) => T[]}
 * @template T 
 */
const _splice = Array.prototype.splice;
/**
 * Inserts new elements at the start of an array, and returns the new length of the array.
 * @param {...T} items Elements to insert at the start of the array.
 * @returns {Number} The new length of the array.
 * @override This overrides {@linkcode Array.prototype.unshift unshift} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
const _unshift = Array.prototype.unshift;
/**
 * Returns this array after copying a section of the array identified by start and end
 * to the same array starting at position target
 * @param {Number} target If target is negative, it is treated as length+target where length is the
 * length of the array.
 * @param {Number} start If start is negative, it is treated as length+start. If end is negative, it
 * is treated as length+end.
 * @param {Number} [end=this.length] If not specified, length of the this object is used as its default value.
 * @returns {T[]} This array, after modification
 * @override This overrides {@linkcode Array.prototype.copyWithin copyWithin} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {(target: number, start: number, end?: number) => T[]} 
 * @template T 
 */
Array.prototype.copyWithin = function (target, start, end = this.length) {
    if (this.hasOwnProperty('onChange')) {
        let v = _copyWithin.call(this, target, start, end);
        this.onChange('copyWithin', this, v);
        return v;
    }
    return _copyWithin.call(this, target, start, end);
};


/**
 * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
 * @param {T} value value to fill array section with
 * @param {Number} [start=0] index to start filling the array at. If start is negative, it is treated as
 * length+start where length is the length of the array. If undefined, 0 is used.
 * @param {Number} [end=this.length] index to stop filling the array at. If end is negative, it is treated as
 * length+end. If undefined, array.length is used.
 * @returns {T[]} The modified array
 * @override This overrides {@linkcode Array.prototype.fill fill} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(value: T, start?: number, end?: number) => T[]}
 * @template T 
 */
Array.prototype.fill = function (value, start = 0, end = this.length) {
    if (this.hasOwnProperty('onChange')) {
        let v = _fill.call(this, value, start, end);
        this.onChange('fill', this, v);
        return v;
    }
    return _fill.call(this, value, start, end);
};

/**
 * Removes the last element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T | undefined} The now-removed last element of the array (or `undefined`)
 * @override This overrides {@linkcode Array.prototype.pop pop} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>() => T | undefined}
 * @template T 
 */
Array.prototype.pop = function () {
    if (this.hasOwnProperty('onChange')) {
        let v = _pop.call(this);
        this.onChange('pop', this, v);
        return v;
    }
    return _pop.call(this);
};

/**
 * Appends new elements to the end of an array, and returns the new length of the array.
 * @param {...T} items New elements to add to the array.
 * @returns {Number} The new length of the array 
 * @override This overrides {@linkcode Array.prototype.push push} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
Array.prototype.push = function (...items) {
    if (this.hasOwnProperty('onChange')) {
        let v = _push.call(this, ...items);
        this.onChange('push', this, v);
        return v;
    }
    return _push.call(this, ...items);
};

/**
 * Reverses the elements in an array in place.
 * This method mutates the array and returns a reference to the same array.
 * @returns {T[]} Returns a reference to this same, now reversed, array 
 * @override This overrides {@linkcode Array.prototype.reverse reverse} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>() => T[]}
 * @template T 
 */
Array.prototype.reverse = function () {
    if (this.hasOwnProperty('onChange')) {
        let v = _reverse.call(this);
        this.onChange('reverse', this, v);
        return v;
    }
    return _reverse.call(this);
};

/**
 * Removes the first element from an array and returns it.
 * If the array is empty, undefined is returned and the array is not modified.
 * @returns {T[] | undefined} The now-removed first element of the array (or `undefined`)
 * @override This overrides {@linkcode Array.prototype.shift shift} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>() => T[] | undefined}
 * @template T 
 */
Array.prototype.shift = function () {
    if (this.hasOwnProperty('onChange')) {
        let v = _shift.call(this);
        this.onChange('shift', this, v);
        return v;
    }
    return _shift.call(this);
};

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
 * @override This overrides {@linkcode Array.prototype.sort sort} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(compareFn?: (a: T, b: T) => number) => T[]}
 * @template T 
 */
Array.prototype.sort = function (compareFn) {
    if (this.hasOwnProperty('onChange')) {
        let v = _sort.call(this, compareFn);
        this.onChange('sort', this, v);
        return v;
    }
    return _sort.call(this, compareFn);
};

/**
 * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
 * @param {Number} start The zero-based location in the array from which to start removing elements.
 * @param {Number} [deleteCount=0] The number of elements to remove. Omitting this argument will remove all elements from the start
 * paramater location to end of the array. If value of this argument is either a negative number, zero, undefined, or a type
 * that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
 * @param {...T} [items=[]] Optional elements to add to the array. If omitted, will only remove elements from the array.
 * @returns {T[]} An array containing the elements that were deleted, including `[]` if nothing was deleted.
 * @override This overrides {@linkcode Array.prototype.splice splice} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(start: number, deleteCount?: number, ...items: T[]) => T[]}
 * @template T 
 */
Array.prototype.splice = function (start, deleteCount = 0, ...items) {
    if (this.hasOwnProperty('onChange')) {
        let v = _splice.call(this, start, deleteCount, ...items);
        this.onChange('splice', this, v);
        return v;
    }
    return _splice.call(this, start, deleteCount, ...items);
};

/**
 * Inserts new elements at the start of an array, and returns the new length of the array.
 * @param {...T} items Elements to insert at the start of the array.
 * @returns {Number} The new length of the array.
 * @override This overrides {@linkcode Array.prototype.unshift unshift} to allow for 
 * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
 * @type {<T>(...items: T[]) => number}
 * @template T 
 */
Array.prototype.unshift = function (...items) {
    if (this.hasOwnProperty('onChange')) {
        let v = _unshift.call(this, ...items);
        this.onChange('unshift', this, v);
        return v;
    }
    return _unshift.call(this, ...items);
};

/**
 * Checks if the given value is contained anywhere in this array
 * @param {T} value Value to check for 
 * @returns {boolean}
 * @type {<T>(value:T) => boolean}
 * @template T 
 */
Array.prototype.contains = function (value) {
    return (this.indexOf(value) >= 0);
}
/**
 * Checks if ANY of the given values are contained in this array
 * @param {...T} value Values to check for 
 * @returns {boolean}
 * @type {<T>(...value:T[]) => boolean}
 * @template T 
 */
Array.prototype.containsAny = function (...value) {
    if (FLATTEN_CONTAINS) { value = /** @type {T[]} */ (value.flat()); }
    for (let i = 0; i < value.length; i++) {
        if (this.contains(value[i])) { return true; }
    }
    return false;
}
/**
 * Checks if ANY of the given values are contained in this array
 * @param {...T} value Values to check for 
 * @returns {boolean}
 * @type {<T>(...value:T[]) => boolean}
 * @template T 
 */
Array.prototype.containsAll = function (...value) {
    if (FLATTEN_CONTAINS) { value = /** @type {T[]} */ (value.flat()); }
    for (let i = 0; i < value.length; i++) {
        if (!this.contains(value[i])) { return false; }
    }
    return true;
}
const FLATTEN_CONTAINS = true;

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
