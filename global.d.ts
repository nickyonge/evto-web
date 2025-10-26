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
         * Optionally-assigned name for this array 
         * @type {string} */
        name?: string;

        /**
         * Checks if the given value is contained anywhere in this array
         * @param {T} value Value to check for 
         * @returns {boolean}
         * @type {<T>(value:T): boolean}
         * @template T 
         */
        contains: (value: T) => boolean;
        /**
         * Checks if ANY of the given values are contained in this array
         * @param {...T} value Values to check for 
         * @returns {boolean}
         * @type {<T>(...value:T[]): boolean}
         * @template T 
         */
        containsAny: (...value: T[]) => boolean;
        /**
         * Checks if ALL of the given values are contained in this array
         * @param {...T} value Values to check for 
         * @returns {boolean}
         * @type {<T>(...value:T[]): boolean}
         * @template T 
         */
        containsAll: (...value: T[]) => boolean;

        /**
         * Callback invoked whenever a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods mutating} 
         * method is called on an array - that is, a method that directly modifies
         * the given array, and doesn't simply reference it (eg, `find()`) or that
         * itself returns an entirely new array or type (eg, `slice()` or `join()`). 
         * Also called when {@linkcode Array.prototype.name name} is changed.
         * @param {string} type The name of the method used on the array, as a string. Eg, `"push"` for {@linkcode Array.prototype.push array.push()}. See below for a comprehensive list. 
         * @param {T[]} source The array object itself that was modified 
         * @param {T} returnValue The value returned by the modified method. Eg, for `type = "pop"`, returns the array's now-removed last element, as per {@linkcode Array.prototype.pop array.pop()}.
         * @param {...T} [parameters=undefined] All parameter values supplied to the array in the invoked method. See below for a comprehensive list. 
         * @returns {void}
         * @see {@link Array.prototype} — All mutating methods, and thus possible values for `type`, include (with parameters): 
         * - {@linkcode Array.prototype.copyWithin copyWithin}, 3 params: `[ target:number, start:number, end?:number=undefined ]` 
         * - {@linkcode Array.prototype.fill fill}, 3 params: `[ value:T, start?:number, end?:number ]` 
         * - {@linkcode Array.prototype.pop pop}, 0 params: `[]` 
         * - {@linkcode Array.prototype.push push}, 0 + [... spread] params: `[...items:any[] ]` 
         * - {@linkcode Array.prototype.reverse reverse}, 0 params: `[]` 
         * - {@linkcode Array.prototype.shift shift}, 0 params: `[]` 
         * - {@linkcode Array.prototype.sort sort}, 1 param: `[ compareFn?:(a:any, b:any):number ]` 
         * - {@linkcode Array.prototype.splice splice}, 2 + [... spread] params: `[ start:number, deleteCount?:number=0, ...items:any[] ]` 
         * - {@linkcode Array.prototype.unshift unshift}, 0 + [... spread] params: `[...items:any[] ]` 
         * 
         * Callback is also invoked for changes of the following properties: 
         * - {@linkcode Array.prototype.name}, 1 param: `[ previousName:string ]`, and a `returnValue` of the newly-assigned `name` value
         * 
         * **NOTE:** the `onChange` callback is NOT invoked when: 
         *  - {@linkcode Array.prototype.length array.length} value is changed 
         *  - A value in the array, eg `myArray[0] = x`, is directly changed 
         * @type {(type:string, source:T[], returnValue:T, ...parameters:T[]): T}
         * @template T 
         */
        onChange?: (type: string, source: T[], returnValue: T, ...parameters: T[]) => T;

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
         * @override This overrides {@linkcode Array.prototype.fill fill} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(value: T, start?: number, end?: number): T[]}
         * @template T 
         */
        fill<T>(value: T, start?: number, end?: number): T[]

        /**
         * Removes the last element from an array and returns it.
         * If the array is empty, undefined is returned and the array is not modified.
         * @returns {T | undefined} The now-removed last element of the array (or `undefined`)
         * @override This overrides {@linkcode Array.prototype.pop pop} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(): T | undefined}
         * @template T 
         */
        pop<T>(): T | undefined;

        /**
         * Appends new elements to the end of an array, and returns the new length of the array.
         * @param {...T} items New elements to add to the array.
         * @returns {Number} The new length of the array 
         * @override This overrides {@linkcode Array.prototype.push push} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(...items: T[]): number}
         * @template T 
         */
        push<T>(...items: T[]): number;

        /**
         * Reverses the elements in an array in place.
         * This method mutates the array and returns a reference to the same array.
         * @returns {T[]} Returns a reference to this same, now reversed, array 
         * @override This overrides {@linkcode Array.prototype.reverse reverse} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(): T[]}
         * @template T 
         */
        reverse<T>(): T[];

        /**
         * Removes the first element from an array and returns it.
         * If the array is empty, undefined is returned and the array is not modified.
         * @returns {T[] | undefined} The now-removed first element of the array (or `undefined`)
         * @override This overrides {@linkcode Array.prototype.shift shift} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
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
         * @override This overrides {@linkcode Array.prototype.sort sort} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
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
         * @override This overrides {@linkcode Array.prototype.splice splice} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(start: number, deleteCount?: number, ...items: T[]): T[]}
         * @template T 
         */
        splice<T>(start: number, deleteCount?: number, ...items: T[]): T[];

        /**
         * Inserts new elements at the start of an array, and returns the new length of the array.
         * @param {...T} items Elements to insert at the start of the array.
         * @returns {Number} The new length of the array.
         * @override This overrides {@linkcode Array.prototype.unshift unshift} to allow for 
         * invoking an {@linkcode Array.prototype.onChange onChange} callback on array objects. 
         * @type {<T>(...items: T[]): number}
         * @template T 
         */
        unshift<T>(...items: T[]): number;

        /**
         * Returns a clone of this array, either using `Array.from()` or `structuredClone`.
         * @param {boolean} [deepClone=false] Use `structuredClone` copy? If false, uses `Array.from()`. Default `false`
         * @returns {T[]} The newly cloned version of the given array 
         * @type {<T>(deepClone:boolean): T[]}
         * @template T 
         */
        clone<T>(deepClone: boolean): T[];
        
        /**
         * Returns a `structuredClone` copy of this array, for deep cloning. Deep cloning creates new value instances for property editing.
         * @returns {T[]} The newly cloned version of the given array 
         * @type {<T>(): T[]}
         * @template T 
         */
        structuredClone<T>(): T[];
        /**
         * Returns a `structuredClone` copy of this array, for deep cloning. Deep cloning creates new value instances for property editing.
         * 
         * Convenience, alternate name of {@linkcode Array.structuredClone}.
         * @returns {T[]} The newly cloned version of the given array 
         * @type {<T>(): T[]}
         * @template T 
         * @borrows structuredClone as deepClone
         */
        deepClone<T>(): T[];

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