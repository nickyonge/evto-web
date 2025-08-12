// some little utilities :3 

/**
 * check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @returns {boolean} true if blank, false if contains content
 */
export const isBlank = str => !str || !str.trim();

/** 
 * Gets the CSS stylesheet for the page.
 * Remember to use `.value` when accessing `style` (eg, `style.value.getPropertyValue`)
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
/** local style reference for utils
 * @type {CSSStyleDeclaration} */
let _style;

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