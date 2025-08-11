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
 * 
 * @param {string} color Hex code formatted color, eg `#FF00FF` 
 * @param {number} opacity Number from 0 to 1 to represent alpha value 
 * @returns Hex code with hex-formatted alpha added
 */
export function AddAlphaToHex(color, opacity) {
    // credit: https://stackoverflow.com/questions/19799777/how-to-add-transparency-information-to-a-hex-color-code/68398236#68398236
    let _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}