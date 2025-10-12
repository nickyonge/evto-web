// some little utilities :3 

/** check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @returns {boolean} true if blank, false if contains content */
export const isBlank = str => !str || (typeof str === 'string' && !str.trim());
/** quick test if the given value is a string @param {string} str string to test @returns {boolean} */
export const isString = str => typeof str == 'string';
/** check if a value IS a string AND IS NOT blank/whitespace/null
 * @param {string} str input string to test 
 * @returns {boolean} true if non-blank string, false is blank or not string */
export const isStringNotBlank = str => isString(str) && !isBlank(str);

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
 * Removes non-numeric chars from a string and returns the resulting number. 
 * Returns null if no number is found. 
 * @param {string} str Input string to convert 
 * @returns {number|null} The parsed number, or null if no digits are found.
 */
export const StringToNumber = str => (str.match(/\d+/) ? parseInt(str.match(/\d+/)[0], 10) : null);

/** Strips away all non-alphanumeric characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringAlphanumericOnly('abc123!@#'); // returns 'abc123' */
export const StringAlphanumericOnly = str => (isBlank(str) ? str : str.replace(/[^a-zA-Z0-9]/g, ''));
/** Strips away all non-numerical characters from a string
 * @param {string} str string to process @returns {string} 
 * @example StringNumericOnly('abc123!@#'); // returns '123' */
export const StringNumericOnly = str => (isBlank(str) ? str : str.replace(/[^0-9]/g, ''));
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
    return element.classList.contains(cssClass);
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
    if (!set) { DeselectElement(element, true); }
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

// TODO: organize lilutils better, so similar utilities are grouped // Issue URL: https://github.com/nickyonge/evto-web/issues/10