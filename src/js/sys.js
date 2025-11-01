//@ts-check
// script for document-level architecture

// SYSTEM/WINDOW-LEVEL - imported to index FIRST, before all other imports are begun


// #region Console

/** Prefix applied to {@linkcode console.if()} call message */
const CONSOLE_IF_PREFIX = '【𝙇𝙤𝙜 𝙄𝙛】[s]\n';
/** Should {@linkcode console.if()} calls be grouped and output full stack trace? */
const CONSOLE_IF_OUTPUT_STACK_TRACE = false;

const CONSOLE_STACK_FORMAT_WEBPACK_LINKS = true;

//@ts-ignore
export const devtoolsURL = import.meta.url;

// Add console.if (log only when the first arg is truthy)
(() => {
    // bind initial log and trace vals 
    const log = Function.prototype.bind.call(console.log, console);
    const trace = Function.prototype.bind.call(console.trace, console);


    Object.defineProperty(console, 'stack', {
        get: function () {
            let s = console.stackString;
            let atIndex = s.indexOf('at ');
            if (atIndex == -1) {
                console.error("Invalid Stack Trace found, no lines exported, \"at\" not found, investigate", console.stackString);
                return [];
            }
            s = s.slice(atIndex + 3);
            s = s.replace(/\r\n|\n|\r/g, '');
            let a = s.split('at ');
            for (let i = 0; i < a.length; i++) {
                let line = a[i].trim();
                if (CONSOLE_STACK_FORMAT_WEBPACK_LINKS) {
                    let jsIndex = line.indexOf('.js');
                    let dirIndex = line.lastIndexOf('./');// use last, in case of .././js 

                    const advancedImplementation = false;
                    if (!advancedImplementation) {
                        // simple implementation 
                        let parenthesisIndex = line.indexOf(' (');
                        let func = parenthesisIndex == -1 ? '' : line.slice(0, parenthesisIndex);
                        let file = dirIndex == -1 ? '' : line.slice(dirIndex + 1).trim();
                        const stripLineColumn = true;
                        if (stripLineColumn) {
                            let colonCount = 0;
                            for (let i = 0; i < file.length; i++) {
                                if (file[i] === ':') { colonCount++; }
                            }
                            switch (colonCount) {
                                case 0:
                                case 1:
                                    if (file.lastIndexOf(')') == file.length - 1) {
                                        file = file.slice(0, file.length - 1);
                                    }
                                    break;
                                default:
                                    let colonIndex = file.indexOf(':');
                                    colonIndex = colonIndex + file.slice(colonIndex + 1).indexOf(':');// get 2nd index of :
                                    file = file.slice(0, colonIndex);
                                    break;
                            }
                        } else {
                            if (file.lastIndexOf(')') == file.length - 1) {
                                file = file.slice(0, file.length - 1);
                            }
                        }
                        // const linePrefix = 'webpack:///';// gotta ensure this is ok for prod 
                        const linePrefix = '';
                        line = `${func},${linePrefix}${file}`;
                    } else {
                        // advanced implementation

                        // gotta access the webpack context to get the hash ID of each file

                        // (webpack-internal:///./js/assetExporter.js:317:15)
                        // if (dirIndex < 0 || jsIndex < 0) {
                        //     console.warn("WARNING: invalid stack trace line, can't format webpack links", line);
                        //     continue;
                        // }
                        // let url = line.slice(0, jsIndex).slice(dirIndex - jsIndex);
                        // console.log();
                        line = line.replace('webpack-internal', 'webpack');
                        line = line.replace('///./', '///');
                        if (jsIndex >= 0) {
                            let before = line.slice(0, jsIndex);
                            let after = line.slice(jsIndex + 4);
                            line = `${before}.js?${after})`;
                        }
                        // line = 'webpack:///js/sys.js?797c:87';
                    }
                }
                a[i] = line;
            }
            return a;
        },
        configurable: false,
        enumerable: true
    });
    Object.defineProperty(console, 'stackString', {
        get: function () {
            return new Error().stack;
        },
        configurable: false,
        enumerable: true
    });


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
            if (!conditional) { return false; }
            let prefix = CONSOLE_IF_PREFIX;
            let stack = console.stack;
            let stackLine = '';
            for (let i = 0; i < stack.length; i++) {
                if (stack[i].indexOf('console.get') == 0 ||
                    stack[i].indexOf('console.value') == 0 ||
                    stack[i].indexOf('console.log') == 0) {
                    continue;
                }
                stackLine = stack[i];
                break;
            }
            let stackIndex = 0;
            let failsafe = 999;
            while (stackIndex >= 0 && failsafe > 0) {
                failsafe--;
                stackIndex = prefix.indexOf('[s]');
                if (stackIndex >= 0) {
                    prefix = prefix.replace('[s]', stackLine);
                }
                if (failsafe <= 0) {
                    console.error("ERROR hit while loop failsafe, this shouldn't happen, investigate, prefix: " + CONSOLE_IF_PREFIX);
                }
            }
            let msg = (typeof message == 'string' && message.trim() != '') ? `${prefix}${message}` : prefix;
            if (CONSOLE_IF_OUTPUT_STACK_TRACE) {
                console.groupCollapsed(msg);
                log(msg, ...optionalParams);
                trace();
                console.groupEnd();
            } else {
                log(msg, ...optionalParams);
            }
            return true;
        },
        configurable: false,
        writable: false,
        enumerable: true
    });

})();


// #endregion Console 
