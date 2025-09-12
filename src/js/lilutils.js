// some little utilities :3 

/**
 * check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @returns {boolean} true if blank, false if contains content
 */
export const isBlank = str => !str || !str.trim();

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
 * Returns the first sibling of the given element with the given class found. 
 * If none are found, returns null 
 * @param {HTMLElement} element source element to search siblings 
 * @param {string} cssClass class name to check for
 * @returns {HTMLElement} first found element with class, or null
 */
export function GetSiblingWithClass(element, cssClass) {
    let siblings = GetAllSiblings(element);
    if (siblings.length == 0) { return null; }
    for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].classList.contains(cssClass)) {
            return siblings[i];
        }
    }
    return null;
}


/**
 * Deselects (and optionally blurs) the given HTMLElement AND all its children
 * @param {HTMLElement} element HTMLElement to deselect
 * @param {boolean} [alsoBlur=true] also blur (unfocus) the element, or any focused children of the element?  
 */
export function DeselectElement(element, alsoBlur = true) {
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
 * Selects the given HTMLElement (convenience method, just calls `.focus()`)
 * @param {HTMLElement} element 
 */
export function SelectFocusElement(element) {
    element.focus();
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

// TODO: organize this class better, so similar utilities are grouped 