// some little utilities :3 

/** check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @param {boolean} [errorOnNonString=false] 
 * Throw error on a non-string? If false, just return `true`.
 * @returns {boolean} true if blank, false if contains content */
export function isBlank(str, errorOnNonString = true) {
    if (str == null) { return true; }// null/undefined counts as blank
    if (typeof str !== 'string') {
        if (errorOnNonString) {
            throw new Error(`ERROR: can\'t check non-string if blank, returning true. Fix (or set errorOnNonString to false). Type:${typeof str}, value:${str}`);
        }
        return true;
    }
    return !str || !str.trim();
};
/** quick test if the given value is a string @param {string} str string to test @returns {boolean} */
export const isString = str => typeof str == 'string';
/** check if a value IS a string AND IS NOT blank/whitespace/null
 * @param {string} str input string to test 
 * @returns {boolean} true if non-blank string, false is blank or not string */
export const isStringNotBlank = str => isString(str) && !isBlank(str);
/** Returns true only if value IS a string, AND that string IS blank (or whitespace).
 * @param {string} str 
 * @returns {boolean}
 * @see {@link isBlank} */
export const isStringAndBlank = str => isString(str) && isBlank(str);

/** 
 * Checks {@linkcode isStringNotBlank} on the given string. 
 * If it IS a string AND it's not blank, returns that string. If it's blank, or
 * whitespace, or `null`, or not a string, returns `''`.
 * @param {string} str String to check 
 * @param {string} [prefix=undefined] Optional prefix to add, IF the string isn't blank
 * @param {string} [suffix=undefined] Optional suffix to add, IF the string isn't blank
 * @returns {string}
 */
export function ReturnStringNotBlank(str, prefix = undefined, suffix = undefined) {
    if (isStringNotBlank(str)) {
        return `${isStringNotBlank(prefix) ? prefix : ''}${str}${isStringNotBlank(suffix) ? suffix : ''}`
    }
    return '';
}

/** 
 * Gets the CSS stylesheet for the page.
 * 
 * Remember!!! Use `.value` when accessing `style` (eg, `style.value.getPropertyValue`)
 * @type {CSSStyleDeclaration}
 */
export const style = {
    get value() {
        if (!_style) {
            if (!document.body) {
                throw new Error("Body isn't yet loaded, don't call style until after window is loaded");
            }
            _style = window.getComputedStyle(document.body);
        }
        return _style;
    }
};
/** local {@link style} reference for utils
 * @type {CSSStyleDeclaration} */
let _style;

/**
 * Gets a CSS variable from loaded stylesheets
 * @param {string} varName Name of variable. Should start with `--`, but if not, it will be added
 * @returns Value of the given variable
 */
export function GetCSSVariable(varName) {
    if (isBlank(varName)) { return; }
    if (!varName.startsWith('--')) {
        varName = `${varName.startsWith('-') ? '-' : '--'}${varName}`;
    }
    return style.value.getPropertyValue(varName);
}

/**
 * Insert a given string `insert` into the `base` string at index `index` 
 * @param {string} base String to modify 
 * @param {string} insert String to insert into `base`
 * @param {number} [index = -1] index to insert `insert` into `base` at. If -1, automatically places at end. 
 * @returns {string}
 */
export function InsertString(base, insert, index = -1) {
    if (!isString(base)) { return base; } // null/invalid base, return base 
    if (!isString(insert)) { return base; } // null/invalid insert, return base 
    if (!Number.isFinite(index)) { return base; } // invalid number, return base 
    if (index == -1) { index = base.length; } // -1, match to base length
    if (index < 0 || index > base.length) {
        console.warn("WARNING: index must be a positive value within the size of base (or -1), can't insert string, returning base", base, insert, index);
        return base;
    }
    // create regex for index param, insert, and return 
    const regex = new RegExp(`(^.{${index}})`);
    return base.replace(regex, `$1${insert}`);
}

/**
 * Takes a value, and ensures that it's a number. If `value` isn't a number
 * and can't be parsed, returns NaN and optionally outputs an error.
 * @param {number|any} value Input value to convert to a Number 
 * @param {boolean} [errorOnFailure=true] output an error upon parsing failure? Default `true`
 * @returns {number}
 */
export function EnsureToNumber(value, errorOnFailure = true) {
    function failure(reason) {
        if (errorOnFailure) {
            console.error(`ERROR: failed to parse value: ${value} (type: ${typeof value}) to Number, ${reason}`, value);
        }
        return NaN;
    }
    if (value == null) { return failure('value is null or undefined'); }
    switch (typeof value) {
        case 'number': return value;
        case 'string': return StringToNumber(value);
        case 'boolean': return value ? 1 : 0;
        case 'bigint': return Number(value);
        default:
            // other type - attempt to coerce to number
            const n = Number(value);
            if (Number.isFinite(n)) { return n; }
            // failed, before checking if n is Infinity, -Infinity, or NaN, try toString 
            const s = value.toString();
            if (isStringNotBlank(s)) {
                const sn = StringToNumber(s);
                if (Number.isFinite(sn)) { return sn; }
                if (IsNumberInfiniteOrNaN(sn)) { return sn; }
            }
            // infinity/NaN n check 
            if (IsNumberInfiniteOrNaN(n)) { return n; }
            if (n == null || typeof n != 'number') {
                // conversion fully failed
                return failure('failed to convert value, likely too complex for conversion');
            }
            // unspecified error 
            return failure('catastrophic error?? like, how???');
    }
}

/**
 * Checks if the given number is explicitly 
 * `Infinity`, `-Infinity`, or `NaN`
 * @param {number} num Number to check  
 * @returns {boolean} */
export function IsNumberInfiniteOrNaN(num) {
    if (num == null || typeof num != 'number') { return false; }
    if (Number.isFinite(num)) { return false; }
    return num === Infinity || num === -Infinity || num === NaN;
}

/**
 * Removes {@link StringNumericOnly non-numeric} chars from a string and returns the resulting number. 
 * Returns `NaN` if no number is found. 
 * @param {string} str Input string to convert 
 * @param {boolean} [parseToInt = false] If true, returns `int`. If false, returns `Number`. Default `false`. 
 * @returns {number|NaN} The parsed number, or `NaN` if no digits are found.
 */
export function StringToNumber(str, parseToInt = false) {
    if (!isStringNotBlank(str)) { return typeof str == 'number' ? str : NaN; }
    let strLow = str.toLowerCase().trim();
    if (strLow == 'infinity') { return Infinity; }
    else if (strLow == '-infinity') { return -Infinity; }
    else if (strLow == 'nan') { return NaN; }
    if (!StringContainsNumeric(str)) { return NaN; }
    str = StringNumericOnly(str);// strip away all non-numeric chars 
    return parseToInt ? parseInt(str) : Number(str);
}

/**
 * Ensures a numeric string does not exceed the given number of decimal places.
 * 
 * **NOTE:** does NOT round the string. If you want it rounded, use {@link StringToNumber} and {@link Number.toMax toMax}.
 * @param {string} str 
 * @param {number} [maxDecimals=3] 
 * @param {boolean} [preProcessStringToNumeric=true] 
 * @returns {string|null}
 */
export function StringNumericToMax(str, maxDecimals = 3, preProcessStringToNumeric = true) {
    if (!isString(str)) { return null; }
    else if (isBlank(str)) { return ''; }
    if (preProcessStringToNumeric) { str = StringNumericOnly(str); }
    if (maxDecimals < 0) { return str; }
    let i = str.indexOf('.');
    if (i < 0) { return str; }
    if (maxDecimals == 0) { return str.substring(0, i); }
    if (str.length < i + maxDecimals + 1) { return str; }
    return str.substring(i + maxDecimals + 1);
    // if (str.length > )
}

/** Strips away all non-alphanumeric characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringAlphanumericOnly('abc123!@#'); // returns 'abc123' */
export const StringAlphanumericOnly = str => (isBlank(str) ? str : str.replace(/[^a-zA-Z0-9]/g, ''));
/** Strips away all non-numerical characters from a string
 * @param {string} str string to process
 * @param {boolean} [keepNumericSymbols=true] If true, keeps one `-` at the start of the number, and one `.` within the number
 * @returns {string} 
 * @example StringNumericOnly('abc-12.34!@#'); // returns '-12.34' */
export function StringNumericOnly(str, keepNumericSymbols = true) {
    if (isBlank(str)) { return str; }
    str = str.replace(/[^0-9.-]/g, ''); // remove non-nums, keep . and - 
    str = str.replace(/(?!^)-/g, ''); // keep one - at the start, if present
    let decimal = str.indexOf('.'); // get first index of decimal point 
    str = str.replaceAll('.', ''); // remove all periods 
    if (decimal >= 0) { str = InsertString(str, '.', decimal); }
    return str;
};
/** Strips away all non-alphabetical characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringAlphaOnly('abc123!@#'); // returns 'abc' */
export const StringAlphaOnly = str => (isBlank(str) ? str : str.replace(/[^a-zA-Z]/g, ''));

/** Strips away all alphanumeric characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringRemoveAlphanumeric('abc123!@#'); // returns '!@#' */
export const StringRemoveAlphanumeric = str => (isBlank(str) ? str : str.replace(/[a-zA-Z0-9]/g, ''));
/** Strips away all numerical characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringRemoveNumeric('abc123!@#'); // returns 'abc!@#' */
export const StringRemoveNumeric = str => (isBlank(str) ? str : str.replace(/[0-9]/g, ''));
/** Strips away all alphabetical characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringRemoveAlpha('abc123!@#'); // returns '123!@#' */
export const StringRemoveAlpha = str => (isBlank(str) ? str : str.replace(/[a-zA-Z]/g, ''));

/** Checks if string contains ANY alphanumeric characters 
 * @param {string} str string to check @returns {boolean} */
export const StringContainsAlphanumeric = str => (isStringNotBlank(str) && /[a-zA-Z0-9]/.test(str));
/** Checks if string contains ANY numerical characters 
 * @param {string} str string to check @returns {boolean} */
export const StringContainsNumeric = str => (isStringNotBlank(str) && /[0-9]/.test(str));
/** Checks if string contains ANY alphabetical characters 
 * @param {string} str string to check @returns {boolean} */
export const StringContainsAlpha = str => (isStringNotBlank(str) && /[a-zA-Z]/.test(str));

/** Checks if string contains ONLY alphanumeric characters 
 * @param {string} str string to check @returns {boolean} */
export const StringOnlyAlphanumeric = str => (isStringNotBlank(str) && /^[a-zA-Z0-9]+$/.test(str));
/** Checks if string contains ONLY numerical characters 
 * @param {string} str string to check @returns {boolean} */
export const StringOnlyNumeric = str => (isStringNotBlank(str) && /^[0-9]+$/.test(str));
/** Checks if string contains ONLY alphabetical characters 
 * @param {string} str string to check @returns {boolean} */
export const StringOnlyAlpha = str => (isStringNotBlank(str) && /^[a-zA-Z]+$/.test(str));

/** checks if the given string has any numbers in it, and if so, 
 * returns the index of the first number found. Otherwise, returns -1 
 * @param {string} str string to check @returns {number} */
export const StringIndexOfFirstNumber = str => {
    if (!isStringNotBlank(str)) { return -1 }; return str.search(/[0-9]/);
};

/** Splits a string into an array of alternating numeric and
 * non-numeric parts. Numeric parts are converted to numbers.
 * Pure numbers are returned in a single-value array. 
 * If `null` or neither a number nor string, returns `null`.
 * @param {string} str
 * @returns {(string|number)[]|null} Array of string and number segments
 * @example 
 * StringNumericDivider('abc123def!@#456?'); // ['abc',123,'def!@#',456,'?'] 
 * StringNumericDivider('no numbers');       // ['no numbers'] 
 * StringNumericDivider('123');              // [123] 
 * StringNumericDivider(456);                // [456] 
 */
export const StringNumericDivider = str => {
    if (str == null) { return null; } // null, return
    if (typeof str == 'number') { return [str]; } // number, return in array 
    if (!isString(str)) return null; // neither string nor number 
    if (isBlank(str)) { return [str]; } // blank/whitespace string, return in array  
    // find all numeric/non-numeric sequences, and split
    const strReg = str.match(/\d+(?:\.\d+)?|\D+/g);
    if (!strReg) return []; // if none found, return
    // map to array and convert numeric-only values to number 
    return strReg.map(s => /^\d+(?:\.\d+)?$/.test(s) ? Number(s) : s);
};

/**
 * Adds an alpha value to a hex code via 0-1 numeric value
 * @param {string} color Hex code formatted color, eg `#FF00FF` 
 * @param {number} opacity Number from 0 to 1 to represent alpha value 
 * @returns Hex code with hex-formatted alpha added
 */
export function AddAlphaToHex(color, opacity) {
    // credit: https://stackoverflow.com/questions/19799777/how-to-add-transparency-information-to-a-hex-color-code/68398236#68398236
    let _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

/**
 * Gets the longest length array found in a given 2d array
 * @param {Array<Array<any>>} arrays 2d array 
 * @returns {number} max length found of all arrays in 2d array, 
 * or 0 if invalid/error 
 */
export function MaxLength2DArray(arrays) {
    if (!Is2DArray(arrays)) { return 0; }
    let max = 0;
    for (let i = 0; i < arrays.length; i++) {
        if (!Array.isArray(arrays[i])) { continue; }
        let len = arrays[i].length;
        if (len > max) { max = len; }
    }
    return max;
}

/**
 * Determine if the given `arrays` value is, in fact, a 2D array
 * @param {Array<Array<any>>} arrays 2d array 
 * @param {boolean} [checkAllArrayIndices = true] check all indices?
 * if true, returns `false` if any indices ARE NOT an array. if false,
 * returns `true` if any indices ARE an array.
 * @returns {boolean}
 */
export function Is2DArray(arrays, checkAllArrayIndices = true) {
    if (!arrays) { return false; }
    if (!Array.isArray(arrays)) { return false; }
    if (arrays.length == 0) { return false; }
    for (let i = 0; i < arrays.length; i++) {
        if (checkAllArrayIndices) {
            if (!Array.isArray(arrays[i])) {
                return false;
            }
        } else {
            if (Array.isArray(arrays[i])) {
                return true;
            }
        }
    }
    return checkAllArrayIndices;
}

/**
 * Takes an array or 2D array, and ensures all its indices are also arrays. 
 * Eg, [[1],2,3,[4,5]] will become [[1],[2],[3],[4,5]]
 * @param {Array<Array<any>>|Array<any>} array array to convert into 2d array
 * @returns {Array<Array<any>>} 2d array version of input array 
 */
export function ConvertArrayIndicesTo2DArray(array) {
    if (!array) { return null; }
    if (!Array.isArray(array)) { return null; }
    if (array.length == 0) { return array; }
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] == null || array[i] == undefined) {
            // null/undefined value, push empty array
            // newArray.push([null]);
            newArray.push([]);
        } else if (Array.isArray(array[i])) {
            // already an array, push into new array 
            newArray.push(array[i]);
        } else {
            // not an array, push new value in its own array into array
            newArray.push([array[i]]);
        }
    }
    return newArray;
}


/**
 * Get all sibling elements to the given element
 * @param {HTMLElement} element 
 * @returns {HTMLElement[]}
 */
export function GetAllSiblings(element) {
    if (!element || !element.parentNode) { return []; }
    return Array.from(element.parentNode.children).
        filter(sibling => sibling !== element);
}
/**
 * Get all parent elements to the given child element
 * @param {HTMLElement} child 
 * @returns {HTMLElement[]}
 */
export function GetAllParents(child) {
    if (child == null || child.parentElement == null) { return []; }
    let parents = [];
    let currentElement = child;
    while (currentElement && currentElement !== document.body && currentElement !== document.documentElement) {
        currentElement = currentElement.parentNode;
        if (currentElement) { // Ensure currentElement is not null before pushing
            parents.push(currentElement);
        }
    }
    return parents;
}
/**
 * Get all children of the given element, optionally recursively getting subsequent children
 * @param {HTMLElement} parent parent element
 * @param {boolean} [recursive = true] include children of children? default true
 * @returns {HTMLElement[]}
 */
export function GetAllChildren(parent, recursive = true) {
    if (!recursive) { return [...parent.children]; }
    let children = [];
    for (const child of parent.children) {
        children.push(child);
        if (child.children.length > 0) {
            children = children.concat(GetAllChildren(child, true));
        }
    }
    return children;
}
/**
 * Returns the first sibling of the given element with the given class found. 
 * If none are found, returns null 
 * @param {HTMLElement} element source element to search siblings 
 * @param {string} cssClass class name to check for
 * @returns {HTMLElement|null} first found sibling element with class, or null
 */
export function GetSiblingWithClass(element, cssClass) {
    let siblings = GetAllSiblings(element);
    if (siblings.length == 0) { return null; }
    for (let i = 0; i < siblings.length; i++) {
        if (ElementHasClass(siblings[i], cssClass)) {
            return siblings[i];
        }
    }
    return null;
}
/**
 * Returns all siblings of the given element with the given class found.
 * @param {HTMLElement} element source element to search siblings 
 * @param {string} cssClass class name to check for
 * @returns {HTMLElement[]} all sibling elements with class
 */
export function GetAllSiblingsWithClass(element, cssClass) {
    let siblings = GetAllSiblings(element);
    if (siblings.length == 0) { return []; }
    let siblingsWithClass = [];
    for (let i = 0; i < siblings.length; i++) {
        if (ElementHasClass(siblings[i], cssClass)) {
            siblingsWithClass.push(siblings[i]);
        }
    }
    return siblingsWithClass;
}
/**
 * Returns the first child of the given element with the given class found. 
 * If none are found, returns null 
 * @param {HTMLElement} parentElement source parent element to search the children of 
 * @param {string} cssClass class name to check for 
 * @returns {HTMLElement|null} first found child element with class, or null
 */
export function GetChildWithClass(parentElement, cssClass) {
    for (const child of parentElement.children) {
        if (ElementHasClass(child, cssClass)) {
            return child;
        }
    }
    return null;
}
/**
 * Returns all children of the given element with the given class found
 * @param {HTMLElement} parentElement source parent element to search the children of 
 * @param {string} cssClass class name to check for 
 * @returns {HTMLElement[]} child elements with class
 */
export function GetAllChildrenWithClass(parentElement, cssClass) {
    let children = GetAllChildren(parentElement);
    if (children == []) { return null; }
    let childrenWithClass = [];
    for (let i = 0; i < children.length; i++) {
        if (ElementHasClass(children[i], cssClass)) {
            childrenWithClass.push(children[i]);
        }
    }
    return childrenWithClass;
}
/**
 * Returns the first parent of the given element with the given class found. 
 * If none are found, returns null 
 * @param {HTMLElement} childElement source child element to search the parents of 
 * @param {string} cssClass class name to check for 
 * @returns {HTMLElement|null} first found parent element with class, or null
 */
export function GetParentWithClass(childElement, cssClass) {
    let parents = GetAllParents(childElement);
    if (parents == []) { return null; }
    for (let i = 0; i < parents.length; i++) {
        if (ElementHasClass(parents[i], cssClass)) {
            return parents[i];
        }
    }
    return null;
}
/**
 * Returns all parents of the given element with the given class found. 
 * @param {HTMLElement} childElement source child element to search the parents of 
 * @param {string} cssClass class name to check for 
 * @returns {HTMLElement[]} parent elements with class, or null
 */
export function GetAllParentsWithClass(childElement, cssClass) {
    let parents = GetAllParents(childElement);
    if (parents == []) { return []; }
    let parentsWithClass = [];
    for (let i = 0; i < parents.length; i++) {
        if (ElementHasClass(parents[i], cssClass)) {
            parentsWithClass.push(parents[i]);
        }
    }
    return parentsWithClass;
}
/**
 * Convenience method, just checks if the given element has the given CSS class
 * @param {Element} element 
 * @param {string} cssClass 
 * @returns {boolean}
 */
export function ElementHasClass(element, cssClass) {
    return element != null && element.classList.contains(cssClass);
}


/**
 * Deselects (and optionally blurs) the given HTMLElement AND all its children
 * @param {HTMLElement} element HTMLElement to deselect
 * @param {boolean} [alsoBlur=true] also blur (unfocus) the element, or any focused children of the element?  
 */
export function DeselectElement(element, alsoBlur = true) {
    // ensure element is non-null
    if (element == null) { return; }
    // get selection 
    const selection = window.getSelection();
    // ensure that selection(s) exist
    if (selection.rangeCount) {
        for (let i = 0; i < selection.rangeCount; i++) {
            const range = selection.getRangeAt(i);
            // check if the selection intersects the given element
            if (element.contains(range.commonAncestorContainer)) {
                selection.removeAllRanges();
                break;
            }
        }
    }
    if (alsoBlur) {
        // check for any active elements / descendants to defocus 
        const active = document.activeElement;
        if (element.contains(active)) {
            active.blur();
        }
    }
}

/**
 * Deselect ALL selected elements on the page 
 * @param {boolean} [alsoBlur=true] also blur (unfocus) any and all focused elements?
 */
export function DeselectAll(alsoBlur = true) {
    window.getSelection().removeAllRanges();
    if (alsoBlur) {
        if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
        }
    }
}

/**
 * Selects the given Element, with optional config parameters
 * @param {HTMLElement} element element to select
 * @param {boolean} [focusVisible = true] 
 * @param {boolean} [preventScroll = false] 
 */
export function SelectFocusElement(element, focusVisible = true, preventScroll = false) {
    element.focus({ focusVisible: focusVisible, preventScroll: preventScroll });
}

/**
 * Returns the current active element (convenience method, just calls `document.activeElement`)
 * @returns {Element|null}
 */
export function GetActiveElement() {
    return document.activeElement;
}
/**
 * Returns true if the given element is the currently active element
 * @param {Element} element 
 * @returns {boolean}
 */
export function IsActiveElement(element) {
    if (!element) { return false }
    return element == GetActiveElement();
}

/**
 * Enables or disables the given HTML element by doing the following:
 * - On Enable...
 *   - Setting `pointerEvents` attribute to `'auto'`
 *   - Removing `aria-hidden` attribute
 *   - Removing `inert` attribute
 *   - Removing `tabIndex` attribute, including on all interactive children,
 *     unless a `preservedTabIndex` attribute is found, who's value will be used instead.
 * - On Disable...
 *   - Calls `DeselectElement` to deselect and blur the element
 *   - Setting `pointerEvents` attribute to `'none'`
 *   - Setting `tabIndex` attribute to `-1`, including to all interactive children
 *   - Setting `aria-hidden` attribute to `true`
 *   - Setting `inert` attribute to `''`
 * @param {HTMLElement} element HTMLElement to fully enable or disable
 * @param {boolean} [set=true] state to assign, `true` to Enable (default), or `false` to Disable 
 */
export function SetElementEnabled(element, set = true) {
    if (!set) {
        DeselectElement(element, true);
        element.draggable = set ? 'auto' : 'false';
    }
    element.style.pointerEvents = set ? 'auto' : 'none';
    if (set) {
        // enable 
        if (element.hasAttribute('preservedTabIndex')) {
            element.setAttribute('tabIndex', element.getAttribute('preservedTabIndex'));
        } else {
            element.removeAttribute('tabIndex');
        }
        element.removeAttribute('aria-hidden');
        element.removeAttribute('inert');
    } else {
        // disable 
        element.setAttribute('tabIndex', '-1');
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('inert', '');
    }
    element.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(el => {
        if (set) {
            // enable 
            if (el.hasAttribute('preservedTabIndex')) {
                el.setAttribute('tabIndex', el.getAttribute('preservedTabIndex'));
            } else {
                el.removeAttribute('tabIndex');
            }
        } else {
            // disable 
            el.setAttribute('tabIndex', '-1');
        }
        if ('disabled' in el) el.disabled = !set;
    });
}

/**
 * Disables the given HTML element by doing the following:
 * - Setting `pointerEvents` attribute to `'none'`
 * - Setting `tabIndex` attribute to `-1`, including to all interactive children
 * - Setting `aria-hidden` attribute to `true`
 * - Setting `inert` attribute to `''`
 * 
 * Convenience function; simply calls `SetElementEnabled(element,false);`
 * @param {HTMLElement} element Element to fully disable
 */
export function SetElementDisabled(element) {
    SetElementEnabled(element, false);
}

/**
 * Lerps (linearly interpolates) between an origin `a` and 
 * target `b` number by the given time value. 
 * @param {number} a Origin value, if `t == 0`
 * @param {number} b Target value, if `t == 1` 
 * @param {number} t Interpolation amount. 0 returns origin, 
 * 1 returns target, 0.5 returns halfway between the two. 
 * @returns {number}
 */
export function Lerp(a, b, t) { return a + ((b - a) * t); }

/** 
 * Gets the interpolation factor for the given value within the
 * given range. If value is between `min` and `max`, returns a
 * value between `0` and `1`. 
 * 
 * Values below `min` will be `< 0`, above `max` will be `> 1`.
 * 
 * If `min` and `max` are equal, values below `min` will return
 * `-Infinity`, and above `max` will return `Infinity`.
 * @param {Number} value Value to determine normalized range of 
 * @param {Number} min Minimal value, the "start" of the range 
 * @param {Number} max Maximal value, the "end" of the range 
 * @returns {Number}
 */
export function InverseLerp(value, min, max) {
    if (!Number.isFinite(value)) { return NaN; }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        if (min == null || max == null || typeof min != 'number' || typeof max != 'number') { return NaN; }
        if (Number.isFinite(min)) { return -Infinity; } return Infinity;
    }
    if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(value)) { return NaN; }
    if (min === max) {
        if (min === value) { return 0; }// could be 0 or 1 
        if (start === 0) { return NaN; }// can't divide by zero
        if (value < min) { return -Infinity; } return Infinity;
    }
    return (value - min) / (max - min);
}

/** 
 * Convert the given `x` amd `y` coordinates to a `point` object
 * @param {number} x  @param {number} y 
 * @returns {{x:number, y:number}} an object with given `.x` and `.y` coordinate properties */
export function toPoint(x, y) { return { x: x, y: y }; }
/**
 * Checks if the given value `pt` is a {@link toPoint point} object (an object with `.x` and `.y` properties)
 * @param {{x:number, y:number}} pt Point to check
 * @param {boolean} [strict = false] If true, performs a stricter check, ensuring `x` and `y` are non-inherited numbers 
 * @returns {boolean} */
export function isPoint(pt, strict = false) {
    if (pt == null || typeof pt != 'object') return false;
    return strict ?
        pt.hasOwnProperty('x') && pt.hasOwnProperty('y') &&
        typeof pt.x == 'number' && typeof pt.y == 'number' :
        'x' in pt && 'y' in pt;
}
/**
 * Checks (non-strict) if all the given values are {@link toPoint point} objects
 * @param  {...{x:number, y:number}} pts array or values of, hopefully, {@link toPoint point} objects
 * @returns {boolean}
 */
export function arePoints(...pts) {
    if (pts == null || !Array.isArray(pts)) { return false; }
    pts = pts.flat();
    for (let i = 0; i < pts.length; i++) {
        if (!isPoint(pts[i])) { return false; }
    }
    return true;
}

/**
 * Rotates the given X/Y coordinates around the given X/Y pivot point by the given angle, in degrees (default) or radians 
 * @param {number} pointX X coordinate to be rotated @param {number} pointY Y coordinate to be rotated 
 * @param {number} pivotX X coordinate to rotate around @param {number} pivotY Y coordinate to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointXYAroundPivotXY(pointX, pointY, pivotX, pivotY, angle, inDegrees = true) {
    return RotatePointAroundPivot(toPoint(pointX, pointY), toPoint(pivotX, pivotY), angle, inDegrees);
}
/**
 * Rotates the given XY point around the given pivot point by the given angle, in degrees (default) or radians 
 * @param {number} pointX X coordinate to be rotated @param {number} pointY Y coordinate to be rotated 
 * @param {{x:number, y:number}} pivot XY {@link toPoint point} coordinates to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointXYAroundPivot(pointX, pointY, pivot, angle, inDegrees = true) {
    return RotatePointAroundPivot(toPoint(pointX, pointY), pivot, angle, inDegrees);
}
/**
 * Rotates the given XY point around the given pivot point by the given angle, in degrees (default) or radians 
 * @param {{x:number, y:number}} point XY {@link toPoint point} coordinates to be rotated 
 * @param {number} pivotX X coordinate to rotate around @param {number} pivotY Y coordinate to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointAroundPivotXY(point, pivotX, pivotY, angle, inDegrees = true) {
    return RotatePointAroundPivot(point, toPoint(pivotX, pivotY), angle, inDegrees);
}
/**
 * Rotates the given XY point around the given pivot point by the given angle, in degrees (default) or radians 
 * @param {{x:number, y:number}} point XY {@link toPoint point} coordinates to be rotated 
 * @param {{x:number, y:number}} pivot XY {@link toPoint point} coordinates to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointAroundPivot(point, pivot, angle, inDegrees = true) {
    // translate to origin 
    point.x -= pivot.x;
    point.y -= pivot.y;
    // rotate
    point = RotatePointAroundOrigin(point, angle, inDegrees);
    // translate back 
    point.x += pivot.x;
    point.y += pivot.y;
    return point;
}
/**
 * Rotates the given point around origin [0,0] by the given angle, in degrees (default) or radians 
 * @param {number} pointX X coordinate to be rotated @param {number} pointY Y coordinate to be rotated 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointXYAroundOrigin(pointX, pointY, angle, inDegrees = true) {
    return RotatePointAroundOrigin(toPoint(pointX, pointY), angle);
}
/**
 * Rotates the given point around origin [0,0] by the given angle, in degrees (default) or radians 
 * @param {{x:number, y:number}} point XY {@link toPoint point} coordinates to be rotated 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}} a {@link toPoint point} with given `.x` and `.y` coordinate properties, rotated as specified */
export function RotatePointAroundOrigin(point, angle, inDegrees = true) {
    // if needed, convert degrees to radians 
    if (inDegrees) { angle = AngleDegreesToRadians(angle); }
    // rotate around origin 
    let rx = (point.x * Math.cos(angle)) - (point.y * Math.sin(angle));
    let ry = (point.x * Math.sin(angle)) + (point.y * Math.cos(angle));
    point.x = rx;
    point.y = ry;
    return point;
}

/** Convert radians to degrees @param {number} radians @see {@link AngleDegreesToRadians} @returns {number} */
export function AngleRadiansToDegrees(radians) { return radians * (180 / Math.PI); }
/** Convert degrees to radians @param {number} radians @see {@link AngleRadiansToDegrees} @returns {number} */
export function AngleDegreesToRadians(degrees) { return degrees * (Math.PI / 180); }

/**
 * Takes an array of XY {@link toPoint points}, determines their shared center, and rotates them all around it 
 * @param {{x:number, y:number}[]} points Array of {@link toPoint points}, to all rotate around their calculated shared center 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}[]} input array, with all points rotated as specified */
export function RotatePointsAroundSharedCenter(points, angle, inDegrees = true) {
    let center = FindPointsSharedCenter(points);
    return RotatePointsAroundPivot(points, center, angle, inDegrees);
}
/**
 * Takes an array of XY {@link toPoint points} and rotates them all around the given pivot coordinates 
 * @param {{x:number, y:number}[]} points Array of {@link toPoint points}, to be rotated 
 * @param {number} pivotX X coordinate to rotate around @param {number} pivotY Y coordinate to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}[]} input array, with all points rotated as specified */
export function RotatePointsAroundPivotXY(points, pivotX, pivotY, angle, inDegrees = true) {
    return RotatePointsAroundPivot(points, toPoint(pivotX, pivotY), angle, inDegrees);
}
/**
 * Takes an array of XY {@link toPoint points} and rotates them all around the given pivot point 
 * @param {{x:number, y:number}[]} points Array of {@link toPoint points}, to be rotated 
 * @param {{x:number, y:number}} pivot XY {@link toPoint point} coordinates to rotate around 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}[]} input array, with all points rotated as specified */
export function RotatePointsAroundPivot(points, pivot, angle, inDegrees = true) {
    points.forEach(point => { point = RotatePointAroundPivot(point, pivot, angle, inDegrees); });
    return points;
}
/**
 * Takes an array of XY {@link toPoint points} and rotates them all around origin [0,0] 
 * @param {{x:number, y:number}[]} points Array of {@link toPoint points}, to be rotated 
 * @param {number} angle Angle to rotate by, in degrees (default) or radians 
 * @param {boolean} [inDegrees=true] If `angle` in degrees? If false, angle is in radians 
 * @returns {{x:number, y:number}[]} input array, with all points rotated as specified */
export function RotatePointsAroundOrigin(points, angle, inDegrees = true) {
    points.forEach(point => { point = RotatePointAroundOrigin(point, angle, inDegrees); });
    return points;
}
/**
 * Determines the shared center {@link toPoint point} of all given {@link toPoint points}
 * @param {{x:number, y:number}[]} points Array of {@link toPoint points} to calculate the shared center of 
 * @returns {{x:number, y:number}} Single XY {@link toPoint point} representing the shared center of all given points */
export function FindPointsSharedCenter(...points) {
    // ensure non-null and valid, otherwise return point with NaN coords 
    if (points == null) { return { x: NaN, y: NaN }; }
    points = points.flat();
    if (points.length == 0) { return { x: NaN, y: NaN }; }
    if (points.length == 1) { return points[0]; } // single point, it's its own center 
    // add all points coords together, average, return 
    let center = { x: 0, y: 0 };
    for (let i = 0; i < points.length; i++) {
        center.x += points[i].x;
        center.y += points[i].y;
    }
    center.x /= points.length;
    center.y /= points.length;
    return center;
}

/** local array of intervals and timers @type {Array<Array<string,number>>} */
let _intervals = [];
/**
 * sets a given interval timer label to timestamp of `performance.now()`
 * @param {string} label reference label for the given interval timer 
 */
export function SetInterval(label) {
    SetIntervalTo(label, performance.now());
}
/**
 * sets a given interval timer label to the given timestamp
 * @param {string} label reference label for the given interval timer  
 * @param {number} timestamp numeric timestamp to assign
 */
export function SetIntervalTo(label, timestamp) {
    if (isBlank(label)) {
        console.error(`ERROR: invalid interval label name, can't be null/blank`)
        return;
    }
    for (let i = 0; i < _intervals.length; i++) {
        if (_intervals[i][0] == label) {
            _intervals[i][1] = timestamp;
            return;
        }
    }
    _intervals.push([label, timestamp]);
}
/**
 * returns the stored value for the given interval timer label
 * @param {string} label reference label for the given interval timer 
 * @returns {number} stored value for interval, or `-1` if `label` is null/not found
 */
export function GetInterval(label) {
    if (!label) { return -1; }
    for (let i = 0; i < _intervals.length; i++) {
        if (_intervals[i][0] == label) { return _intervals[i][1]; }
    }
    return -1;
}
/**
 * checks if the given interval timer label exists
 * @param {string} label reference label for the given interval timer 
 * @returns {boolean}
 */
export function DoesIntervalExist(label) {
    for (let i = 0; i < _intervals.length; i++) {
        if (_intervals[i][0] == label) { return true; }
    }
    return false;
}
/**
 * gets the time in ms between the given time interval label's stored value and now
 * @param {string} label reference label for the given interval timer 
 * @returns {number} time in ms, or -1 if label isn't found or is invalid
 */
export function TimeSinceLastInterval(label) {
    let interval = GetInterval(label);
    if (interval == -1) { return -1; }
    return TimeBetweenTimestampAndNow(interval);
}
/**
 * returns true if the given interval timer label's time between its stored value
 * and now is greater than the given lapTime 
 * @param {string} label reference label for the given interval timer 
 * @param {number} lapTime time, in ms, to check between the label interval's stored time and now
 * @returns {boolean} true if equal/more time in ms as `lapTime` has passed
 */
export function HasIntervalLapped(label, lapTime) {
    let timeSince = TimeSinceLastInterval(label);
    if (timeSince == -1) { return false; }
    return timeSince >= lapTime;
}
/**
 * Checks if the given interval timer label's time in ms since last update
 * is the given lapTime or more. If false, returns `false`. If true, updates
 * the interval label's value to now, and returns `true`. If label wasn't already
 * defined, creates it via {@link SetInterval} and returns the value of `returnOnNew`
 * @param {string} label reference label for the given interval timer 
 * @param {number} lapTime time, in ms, to check between the label interval's stored time and now
 * @param {boolean} [returnOnNew = true] value to return if label doesn't already exist and is newly created 
 * @returns {boolean} true if "lap" has passed, false if not, `returnOnNew` if newly created label 
 */
export function LapCheckInterval(label, lapTime, returnOnNew = true) {
    if (!DoesIntervalExist(label)) {
        SetInterval(label);
        return returnOnNew;
    }
    if (HasIntervalLapped(label, lapTime)) {
        // TODO: account for time difference between lapTime and now
        // Issue URL: https://github.com/nickyonge/evto-web/issues/11
        SetInterval(label);
        return true;
    }
    return false;
}
/**
 * Returns the time, in ms, between the given timestamp and `performance.now`
 * @param {number} timestamp timestamp to compare 
 * @returns {number} time, in ms, between the given timestamp and now
 */
export function TimeBetweenTimestampAndNow(timestamp) {
    return TimeBetweenTwoTimestamps(timestamp, performance.now())
}
/**
 * Returns the time, in ms, between the two given timestamps. 
 * Ensures absolute time, doesn't matter which timestamp is larger. 
 * @param {number} timestampA 
 * @param {number} timestampB 
 * @returns {number} time, in ms, between the two given timestamps
 */
export function TimeBetweenTwoTimestamps(timestampA, timestampB) {
    if (timestampB >= timestampA) {
        return timestampB - timestampA;
    }
    return timestampA - timestampB;
}


// #region Environment 

/**
 * Is the {@link _env_currentEnv current} environment `development`/`dev`?
 * 
 * **Note:** also `true` if environment is `null`\`undefined`\`""`.
 * 
 * **Note:** if {@linkcode __TESTING_IS_DEVELOPMENT} is `true`, the environment `testing`/`test` will also return `true`. 
 * @see `PRODUCTION_BUILD` in `webpack.config.js` */
export const _env_isDevelopment =
    _env_currentEnv === null || _env_currentEnv === undefined || _env_currentEnv === '' ||
    _env_currentEnv === 'development' || _env_currentEnv === 'dev' ||
    !_env_isProduction && (!_env_isTest || __TESTING_IS_DEVELOPMENT);
/**
 * Is the {@link _env_currentEnv current} environment `production`/`prod`?
 * 
 * **Note:** if {@linkcode __STAGING_IS_PRODUCTION} is `true`, the environment `staging` will also return `true`. 
 * @see `PRODUCTION_BUILD` in `webpack.config.js` */
export const _env_isProduction =
    _env_currentEnv === 'production' || _env_currentEnv === 'prod' ||
    (_env_isStaging && __STAGING_IS_PRODUCTION);
/**
 * Is the {@link _env_currentEnv current} environment `staging`?
 * 
 * **Note:** if {@linkcode __STAGING_IS_PRODUCTION} is `true`, {@linkcode _env_isProduction} will also return `true`. 
 * @see `PRODUCTION_BUILD` in `webpack.config.js` (allows only `development` and `production`) */
export const _env_isStaging = _env_currentEnv === 'staging';
/** 
 * Is the {@link _env_currentEnv current} environment `testing`/`test`?
 * 
 * **Note:** if {@linkcode __TESTING_IS_DEVELOPMENT} is `true`, {@linkcode _env_isDevelopment} will also return `true`. 
 * @see `PRODUCTION_BUILD` in `webpack.config.js` (allows only `development` and `production`) */
export const _env_isTest = _env_currentEnv === 'testing' || _env_currentEnv === 'test';
/** 
 * Returns the current `process.env.NODE_EVN` environment. Typically `"development"` or `"production"`.
 * @see `PRODUCTION_BUILD` in `webpack.config.js` 
 * @see {@linkcode _env_isDevelopment} 
 * @see {@linkcode _env_isProduction} 
 * @see https://www.geeksforgeeks.org/node-js/what-is-node_env-in-node-js/ */
export const _env_currentEnv = process.env.NODE_ENV;
/** If process.env.NODE_EVN is 'testing', should {@linkcode _env_isDevelopment} return `true`? */
const __TESTING_IS_DEVELOPMENT = true;
/** If process.env.NODE_EVN is 'staging', should {@linkcode _env_isProduction} return `true`? */
const __STAGING_IS_PRODUCTION = true;

// #endregion Environment

// TODO: organize lilutils better, so similar utilities are grouped // Issue URL: https://github.com/nickyonge/evto-web/issues/10