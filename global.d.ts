import type { BasicComponent } from "./src/js/components/base";

declare global {

    interface Node {

        /**
         * Calls the function with the specified object as the this 
         * value and the specified rest arguments as the arguments.
         * @param thisArg The object to be used as the this object.
         * @param args Argument values to be passed to the function.
         * @override This overrides 
         * {@linkcode Node.prototype.appendChild appendChild} to 
         * allow directly adding {@linkcode BasicComponent} classes.
         */
        appendChild<T extends Node>(Node: T): Node;

    }

    interface Array {

        /**
         * Returns this array after copying a section of the array identified by start and end
         * to the same array starting at position target
         * @param {Number} target If target is negative, it is treated as length+target where length is the
         * length of the array.
         * @param {Number} start If start is negative, it is treated as length+start. If end is negative, it
         * is treated as length+end.
         * @param {Number} [end=this.length] If not specified, length of the this object is used as its default value.
         * @returns {T[]} This array, after modification
         * @override This overrides {@linkcode Array.prototype.copyWithin copyWithin}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {(target: number, start: number, end?: number): T[]} 
         * @template T 
         */
        copyWithin(target: number, start: number, end?: number): T[];

        /**
         * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
         * @param {T} value value to fill array section with
         * @param {Number} [start=0] index to start filling the array at. If start is negative, it is treated as
         * length+start where length is the length of the array. If undefined, 0 is used.
         * @param {Number} [end=this.length] index to stop filling the array at. If end is negative, it is treated as
         * length+end. If undefined, array.length is used.
         * @returns {T[]} The modified array
         * @override This overrides {@linkcode Array.prototype.fill fill}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(value: T, start?: number, end?: number): T[]}
         * @template T 
         */
        fill<T>(value: T, start?: number, end?: number): T[]

        /**
         * Removes the last element from an array and returns it.
         * If the array is empty, undefined is returned and the array is not modified.
         * @returns {T | undefined} The now-removed last element of the array (or `undefined`)
         * @override This overrides {@linkcode Array.prototype.pop pop}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(): T | undefined}
         * @template T 
         */
        pop<T>(): T | undefined;

        /**
         * Appends new elements to the end of an array, and returns the new length of the array.
         * @param {...T} items New elements to add to the array.
         * @returns {Number} The new length of the array 
         * @override This overrides {@linkcode Array.prototype.push push}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(...items: T[]): number}
         * @template T 
         */
        push<T>(...items: T[]): number;

        /**
         * Reverses the elements in an array in place.
         * This method mutates the array and returns a reference to the same array.
         * @returns {T[]} Returns a reference to this same, now reversed, array 
         * @override This overrides {@linkcode Array.prototype.reverse reverse}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(): T[]}
         * @template T 
         */
        reverse<T>(): T[];

        /**
         * Removes the first element from an array and returns it.
         * If the array is empty, undefined is returned and the array is not modified.
         * @returns {T[] | undefined} The now-removed first element of the array (or `undefined`)
         * @override This overrides {@linkcode Array.prototype.shift shift}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(): T[] | undefined}
         * @template T 
         */
        shift<T>(): T[] | undefined;

        /**
         * Sorts an array in place.
         * This method mutates the array and returns a reference to the same array.
         * @param {(a: T, b: T): number} compareFn Function used to determine the order of the elements. It is expected to return
         * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
         * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
         * ```ts
         * [11,2,22,1].sort((a, b) => a - b)
         * ```
         * @returns {Array<T>} Reference to this array object 
         * @override This overrides {@linkcode Array.prototype.sort sort}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(compareFn?: (a: T, b: T): number): T[]}
         * @template T 
         */
        sort<T>(compareFn?: (a: T, b: T) => number): T[];

        /**
         * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
         * @param {Number} start The zero-based location in the array from which to start removing elements.
         * @param {Number} [deleteCount=0] The number of elements to remove. Omitting this argument will remove all elements from the start
         * paramater location to end of the array. If value of this argument is either a negative number, zero, undefined, or a type
         * that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
         * @param {...T} [items=undefined] Optional elements to add to the array. If omitted, will only remove elements from the array.
         * @returns {T[]} An array containing the elements that were deleted, including `[]` if nothing was deleted.
         * @override This overrides {@linkcode Array.prototype.splice splice}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(start: number, deleteCount?: number, ...items: T[]): T[]}
         * @template T 
         */
        splice<T>(start: number, deleteCount?: number, ...items: T[]): T[];

        /**
         * Inserts new elements at the start of an array, and returns the new length of the array.
         * @param {...T} items Elements to insert at the start of the array.
         * @returns {Number} The new length of the array.
         * @override This overrides {@linkcode Array.prototype.unshift unshift}
         * to allow for invoking an `onChange` callback on array objects.
         * @type {<T>(...items: T[]): number}
         * @template T 
         */
        unshift<T>(...items: T[]): number;

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

        /**
         * Checks if this number is even, returning `true`, or odd, returning `false`
         * @see {@link Number.isOdd isOdd}
         * @returns {boolean} */
        isEven(): boolean;
        /**
         * Checks if this number is odd, returning `true`, or even, returning `false`
         * @see {@link Number.isEven isEven}
         * @returns {boolean} */
        isOdd(): boolean;
    }

}

export { };