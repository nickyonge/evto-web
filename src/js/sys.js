//@ts-check
// script for document-level architecture

// SYSTEM/WINDOW-LEVEL - imported to index FIRST, before all other imports are begun 


// #region Console

// Add console.if (log only when the first arg is truthy)
(() => {
    // bind initial log 
    const log = Function.prototype.bind.call(console.log, console);
    Object.defineProperty(console, 'if', {
        /**
         * Conditional-based log - only outputs if the given conditional value is `true`.
         * Basically {@linkcode console.assert console.assert()}, except does NOT throw 
         * an error if the conditional is `false`. 
         * 
         * As per {@linkcode console.log}: Prints to stdout with newline. Multiple arguments can be passed, 
         * with the first used as the primary message and all additional used as substitution values similar 
         * to `printf(3)` (the arguments are all passed to 
         * {@linkcode https://nodejs.org/docs/latest-v24.x/api/util.html#utilformatformat-args util.format()}).
         * @param {boolean} conditional Conditional value to check; if `true`, outputs `console.log` with following params 
         * @param {any} [message=undefined] Message to pass to `console.log` 
         * @param {...any} optionalParams Optional params to pass to `console.log`
         * @example
         * const count = 5;
         * console.log('count: %d', count); // Prints: count: 5, to stdout
         * console.log('count:', count); //    Prints: count: 5, to stdout
         * 
         * @see {@linkcode https://nodejs.org/docs/latest-v24.x/api/util.html#utilformatformat-args util.format()} for more information.
         * @returns {boolean} returns the evaluated condition, to chain calls 
         */
        value(conditional, message = undefined, ...optionalParams) {
            if (conditional) log(message, ...optionalParams);
            return Boolean(conditional);
        },
        configurable: true,
        writable: true,
        enumerable: false
    });
})();


// #endregion Console 
