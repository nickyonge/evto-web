import * as svg from './index';
import { isBlank, isStringNotBlank, StringContainsNumeric, StringNumericDivider, StringNumericOnly, StringOnlyNumeric, StringToNumber } from "../lilutils";

/** 
 * Basic element used to create all assets in this lil SVG system (which prolly needs a name)
 * 
 * For the class that you can actually add to your document, see {@linkcode svg.asset svgHTMLAsset}.
 */
export class svgElement {
    /** Array containing all {@linkcode svgElement} instances @type {svgElement[]} */
    static allSVGElements = [];
    /** Filters and returns length of {@linkcode allSVGElements} @returns {Number} */
    static get allSVGElementsCount() { svgElement.#__filterElementsArray(); return svgElement.allSVGElements.length; }
    /** Remove all `null` values from the {@linkcode allSVGElements} array @returns {void} */
    static #__filterElementsArray() { svgElement.allSVGElements = svgElement.allSVGElements.filter(e => e != null); }
    /** Counter for all {@linkcode svgElement svgElements} ever instanced, ensuring unique IDs for each one. */
    static #svgElementsCount = 0;

    /** unique identifier for this element @type {string} */
    get id() { return this.#_id; };
    set id(v) {
        if (this.#_id == v) { return; }
        // ensure ID is unique 
        if (v != null) {
            svgElement.#__filterElementsArray();
            for (let i = 0; i < svgElement.allSVGElements.length; i++) {
                if (svgElement.allSVGElements[i] == this) { continue; }
                if (isStringNotBlank(svgElement.allSVGElements[i].id)) {
                    if (svgElement.allSVGElements[i].id == v) {
                        // yup, IDs match 
                        if (svg.config.REQUIRE_UNIQUE_SVG_ELEMENT_IDS) {
                            console.error(`ERROR: svgElement ID ${v} is already in use. Cannot assign to this svgElement. IDs should be unique.`, this, svgElement.allSVGElements[i]);
                            return;
                        } else {
                            console.warn(`WARNING: svgElement ID ${v} is already in use. This may cause issues. IDs should be unique.`, this, svgElement.allSVGElements[i]);
                        }
                    }
                }
            }
        }
        let prev = this.#_id;
        this.#_id = v;
        if (!this.#_firstIDAssigned) {
            this.#_firstIDAssigned = true;
        } else {
            if (!this.__suppressOnChange) {
                this.__invokeChange('id', v, prev, this);
                if (this.hasOwnProperty('parent')) {
                    this.parent?.__invokeChange('id', v, prev, this);
                }
            }
        }
        if (this.__SKIP_ID_UPDATE == true) {
            // do NOT perform ID update 
        } else {
            // update ID change on all SVG Elements 
            let newURL = this.stringToURL(v);
            for (let i = 0; i < svgElement.allSVGElementsCount; i++) {
                let e = svgElement.allSVGElements[i];
                if (e == null) { continue; }
                // iterate through all keys in an object, check for URLs to update 
                let values = getSortedValues(e).flat();
                for (let i = 0; i < values.length; i++) {
                    if (values[i] == null) { continue; }
                    if (this.isURL(values[i][1])) {
                        // extract id from URL 
                        let s = this.stringFromURL(values[i][1]);
                        if (s == prev) {
                            // yup, found a match! replace ID 
                            e[values[i][0]] = newURL;
                        }
                    }
                }
            }
        }

        //TODO: move object property/getter listing to utils 
        //Issue URL: https://github.com/nickyonge/evto-web/issues/55
        /**
         * Returns a list of all entries (properties, property descriptions) on this object AND its class parent prototype
         * @param {Object} obj Object to get properties of
         * @param {boolean} [skipObjectEntries=true] skip the entries from base `Object` prototype? Default `true`
         * @returns {[string, TypedPropertyDescriptor<any> & PropertyDescriptor][] | []}
         */
        function listAll(obj, skipObjectEntries = false) {
            let prototype = Object.getPrototypeOf(obj);
            if (prototype == null) { return []; }// reached the end! 
            if (skipObjectEntries && prototype.constructor.name === 'Object') { return []; } // don't include Object entries 
            // get all property descriptors 
            let entries = Object.entries(Object.getOwnPropertyDescriptors(prototype));
            if (!obj.__SKIP_INSTANCE_PROPERTIES) {
                // should only run on the first object passed into listAll, which is an iterative function 
                entries = entries.concat(Object.entries(Object.getOwnPropertyDescriptors(obj)));
            }
            let subEntries = [];
            for (let i = 0; i < entries.length; i++) {
                if (entries[i][0] === 'constructor') {
                    let p = entries[i][1].value.prototype;
                    let prev = null;
                    let hasProperty = p.hasOwnProperty('__SKIP_INSTANCE_PROPERTIES');
                    if (hasProperty) {
                        // in the EXTREMELY unlikely chance that an object prototype already has a
                        // property called __SKIP_INSTANCE_PROPERTIES, preserve and restore the value
                        prev = p.__SKIP_INSTANCE_PROPERTIES;
                    }
                    p.__SKIP_INSTANCE_PROPERTIES = true;// skip instance properties on parent constructors 
                    subEntries.push(listAll(p, skipObjectEntries));
                    if (hasProperty) {
                        p.__SKIP_INSTANCE_PROPERTIES = prev;
                    } else {
                        delete (p.__SKIP_INSTANCE_PROPERTIES);
                    }
                }
            }
            for (let i = 0; i < subEntries.length; i++) {
                entries = entries.concat(subEntries[i]);
            }
            return entries;
        }
        function getSortedValues(obj) {
            // [ getters[getter,value], properties[property,value] ]
            let all = listAll(obj);
            let properties = [];
            let getters = [];
            function skipProperty(name) {
                const skipPropertyNames = ['id', 'idURL'];
                return skipPropertyNames.contains(name);
            }
            for (let i = 0; i < all.length; i++) {
                if (all[i] == null) { continue; }
                if (skipProperty(all[i][0])) { continue; }
                if (typeof all[i][1].get === 'function') {
                    let getter = [all[i][0], obj[all[i][0]]];
                    getters.push(getter);
                }
                else if (all[i][1].enumerable && all[i][1].writable) {
                    let property = [all[i][0], obj[all[i][0]]];
                    properties.push(property);
                }
            }
            return [getters, properties];
        }
    }
    /** @type {string} */
    #_id;
    /** local flag for first ID assignment @type {boolean} */
    #_firstIDAssigned = false;

    /** @type {string} */
    get #defaultID() { return `__svgE[${this[__svgElementInstance]}]:${this.constructor.name}`; }

    /**
     * Base class for all component elements of an SVG asset
     * @param {string} [id] 
     */
    constructor(id = null) {
        // record this element's unique instance number
        Object.defineProperty(this, __svgElementInstance, { value: svgElement.#svgElementsCount, configurable: false, enumerable: true, writable: false });
        // set id 
        let skipAutoID = svg.config.IGNORE_AUTO_ID_CLASSES.contains(this.className);
        if (isBlank(id)) {
            if (!skipAutoID) {
                id = this.#defaultID;
            }
        }
        let skip = this.hasOwnProperty('__SKIP_ID_UPDATE');
        let prev = skip ? this.__SKIP_ID_UPDATE : undefined;
        this.__SKIP_ID_UPDATE = true;
        this.id = id;
        if (skip) { this.__SKIP_ID_UPDATE = prev; } else { delete (this.__SKIP_ID_UPDATE); }
        // update SVG Element arrays 
        svgElement.#__filterElementsArray();
        svgElement.allSVGElements.push(this);
        svgElement.#svgElementsCount++;
    }

    /** Unique instance of this svgElement @returns {number} */
    get svgInstance() { return this[__svgElementInstance]; }

    /**
     * Set a callback for when a value in this {@link svgElement} has changed.
     * 
     * Can handle single {@link svg.onChange onChange} method assignments, or
     * {@link svg.onChange onChange[]} arrays (including nested arrays).
     * 
     * **NOTE:** convenience setter! Passes value to {@linkcode AddOnChangeCallback}. 
     * See {@linkcode onChangeCallbacks} for all callbacks, or {@linkcode hasOnChange} 
     * to check if any callback is added. This setter has no getter. 
     * @param {svg.onChange | svg.onChange[]} onChangeCallback {@link svg.onChange onChange} 
     * onChange method to call. Properties are: 
     * - `valueChanged:string` — The name of the value that was changed 
     * - `newValue:any` — The newly assigned value 
     * - `previousValue:any` — The old value, for reference  
     * - `changedElement?:changedElement` — The {@link svgElement} that was changed (default `undefined`)
     */
    set onChange(onChangeCallback) {
        this.AddOnChangeCallback(onChangeCallback);
    };

    /**
     * Set a callback for when a value in this {@link svgElement} has changed. 
     * 
     * Returns the full {@linkcode onChangeCallbacks} array. Passing a `null` value
     * will reset {@linkcode onChangeCallbacks} to `[]`, clearing all callbacks. 
     * (Specifically passing `undefined` will output a console warning.)
     * 
     * Can handle single {@link svg.onChange onChange} method assignments, or
     * {@link svg.onChange onChange[]} arrays (including nested arrays).
     * @param {svg.onChange | svg.onChange[]} onChangeCallback {@link svg.onChange onChange} 
     * onChange method to call. Properties are: 
     * - `valueChanged:string` — The name of the value that was changed 
     * - `newValue:any` — The newly assigned value 
     * - `previousValue:any` — The old value, for reference  
     * - `changedElement?:changedElement` — The {@link svgElement} that was changed (default `undefined`)
     */
    AddOnChangeCallback(onChangeCallback) {
        // if setting null, reset methods 
        if (onChangeCallback == null) {
            if (onChangeCallback === undefined) {
                console.warn("Assigning undefined onChangeCallback. " +
                    "Will reset all onChangeCallbacks on this element, " +
                    "but set null - not undefined - to avoid this warning, " +
                    "in case of unintentional callback clearing.", this);
            }
            this.onChangeCallbacks = []; return;
        }
        // ensure onChangeCallbacks array exsts 
        if (this.onChangeCallbacks == null) { this.onChangeCallbacks = []; }
        // check if adding array or individual methods 
        if (Array.isArray(onChangeCallback)) {
            for (let i = 0; i < onChangeCallback.length; i++) {
                if (onChangeCallback[i] == null) { continue; }
                if (Array.isArray(onChangeCallback[i])) {
                    // handle nested arrays 
                    this.onChange = onChangeCallback[i];
                    continue;
                }
                // check if function - if so, add 
                if (typeof onChangeCallback[i] === 'function') {
                    if (!this.onChangeCallbacks.contains(onChangeCallback)) {
                        this.onChangeCallbacks.push(onChangeCallback);
                    }
                } else {
                    console.warn(`WARNING: can't add value ${onChangeCallback[i]} of invalid type ${typeof onChangeCallback[i]} to onChange callback array (via array), must be function`, onChangeCallback, this);
                }
            }
        } else if (typeof onChangeCallback === 'function') {
            if (!this.onChangeCallbacks.contains(onChangeCallback)) {
                this.onChangeCallbacks.push(onChangeCallback);
            }
        } else {
            console.warn(`WARNING: can't add value ${onChangeCallback} of invalid type ${typeof onChangeCallback} to onChange callback array, must be function`, this);
        }
    }

    /**
     * Does this {@link svgElement} have any {@link svg.onChange onChange} callbacks in the {@linkcode onChangeCallbacks} array?
     * @returns {boolean}
     */
    get hasOnChange() { return this.onChangeCallbacks != null && this.onChangeCallbacks.length > 0; }

    /** 
     * Array of all {@link svg.onChange onChange} methods to call on ths {@link svgElement}, whenever a local change occurs.
     * 
     * **NOTE:** Changing this array or its values itself does NOT invoke a change.
     * @type {svg.onChange[]} 
     * */
    onChangeCallbacks = [];

    /**
     * ***Do not use.*** 
     * 
     * Used internally to invoke a change in this {@link svgElement},
     * including changes bubbled up from subclasses.
     * @param {string} valueChanged The name of the value that was changed 
     * @param {any} newValue The newly assigned value 
     * @param {any} previousValue The old value, for reference  
     * @param {svgElement} [changedElement = undefined] The {@link svgElement} that was changed. If `undefined` (the default value), sends `this` (the {@link svgElement} itself)
     * @returns 
     */
    __invokeChange(valueChanged, newValue, previousValue, changedElement = undefined) {
        if (this.onChangeCallbacks == null) { this.onChangeCallbacks = []; return; }
        for (let i = 0; i < this.onChangeCallbacks.length; i++) {
            if (typeof this.onChangeCallbacks[i] !== 'function') { continue; }
            this.onChangeCallbacks[i]?.(valueChanged, newValue, previousValue, changedElement == null ? this : changedElement);
        }
    }

    /**
     * ***Do not use.*** 
     * 
     * Used internally to prevent multiple {@linkcode onChange} calls 
     * when modifying one property that itself modifies multiple.
     * 
     * Eg, modifying {@link svg.gradient.angle svgGradient.angle} also 
     * modifies that gradient's {@link svg.gradient.x1 x1}, 
     * {@link svg.gradient.y1 y1}, {@link svg.gradient.x2 x2}, and 
     * {@link svg.gradient.y2 y2} properties. However, {@link onChange}
     * should only be invoked once, as only {@link svg.gradient.angle angle}
     * was modified.
     * @type {boolean}
     */
    __suppressOnChange = false;

    /** 
     * get the HTML output of this element. 
     * 
     * **Note:** returns `""` on {@linkcode svgElement} - used only on subclasses, eg {@linkcode svgHTMLAsset}. */
    get html() { return ''; }
    /** 
     * get the data output of this element, typically to be collected into {@linkcode html}. 
     * 
     * **Note:** returns `""` on {@linkcode svgElement} - used only on subclasses, eg {@linkcode svgHTMLAsset}. */
    get data() { return ''; }

    /** Parse array of SVG data into HTML-attribute-style `name="value"` format, 
     * with spaces between attributes as needed. 
     * @param {([string, any?])[]} data 2d array of properties, `[name,value]` 
     * @returns {string} data formatted like `first="1" second="2" third="3"`
     * @example 
     * let myVar = 1;
     * let myVarName = 'first';
     * let array = [[myVarName,myVar], ['two',null], ['third',3], ['blank',''], [null,'null']];
     * let myData = ParseData(array);
     * console.log(myData); // Outputs string: first="1" third="3" blank="" */
    ParseData(data) {
        let d = isBlank(this.id) ? [] : [this.#ParseDatum('id', this.id)];
        data.forEach(datum => {
            let out = this.#ParseDatum(datum[0], datum[1]);
            if (!isBlank(out)) { d.push(out); }
        });
        return d.join(' ');
    }
    /** Parse individual property data for use as an SVG attribute. Returns `''` if invalid.
     * 
     * **Note:** If `value` is an `object`, it will be parsed using `JSON.strngify` 
     * @param {string} name name of property. Can't be null or blank or whitespace
     * @param {any} value value of property. Can't be null, but CAN be blank or whitespace
     * @returns {string} datum formatted like `myName="myValue"`, or `''` if name is empty/null or value is null
     * @example
     * console.log(#ParseDatum('myNumber', 123));  // Output: 'myNumber="123"'
     * console.log(#ParseDatum('isBlank', ''));    // Output: 'isBlank=""'
     * console.log(#ParseDatum('isNull', null));   // Output: 'isNull=""'
     * console.log(#ParseDatum(null, 'nullName')); // Output: ''
     * */
    #ParseDatum(name, value) {
        return `${value == null || isBlank(name) ? '' :
            `${name}=${typeof value === 'object' ? JSON.stringify(value) : `"${value}`}"`}`;
    }

    /**
     * add indentation (`\t`) to the give html string, 
     * if {@link svg.config.HTML_INDENT HTML_INDENT} is true
     * @param {string} html input html string 
     * @param {number} indentCount number of indentations to add 
     * @returns original string with indentation
     */
    IndentHTML(html, indentCount = 1) {
        if (!svg.config.HTML_INDENT || isBlank(html)) { return html; }
        let indent = '';
        for (let i = 0; i < indentCount; i++) { indent += '\t'; }
        html = indent + html;
        if (svg.config.HTML_NEWLINE) {
            // check if ends with newline - if so, don't indent it
            let newlineEnd = html.endsWith('\n');
            if (newlineEnd) { html = html.slice(0, -1); }
            html = html.replaceAll('\n', '\n' + indent);
            if (newlineEnd) { html += '\n'; }
        }
        return html;
    }

    /** 
     * Takes a parameter and:
     * - If it's at all numerical, returns a sequential and 
     * alternating array of its numeric and non-numeric values, or
     * - If it's non-numeric (including `null`), returns itself 
     * @param {string|number|null} value Value to parse, eg `123`, `"50%"`, `"22.5px"`, `"fit-content"`, `"calc(5px + 10%)"`, etc
     * @param {string|number|null} [defaultValue = null] Optional backup value if the input value is `null` 
     * @returns {(string|number)[]|[string]|[number]|null}
     * @example 
     * DeconstructNumericParam(123);               // [123] 
     * DeconstructNumericParam("123");             // [123] 
     * DeconstructNumericParam(null, "50%");       // [50, "%"] 
     * DeconstructNumericParam("22.5px");          // [22.5, "px"] 
     * DeconstructNumericParam("12.34.56.78");     // [12.34, ".", 56.78] 
     * DeconstructNumericParam("fit-content");     // ["fit-content"]
     * DeconstructNumericParam("calc(5px + 10%)"); // ["calc(", 5, "px + ", 10, "%)"] 
     */
    DeconstructNumericParam(value, defaultValue = null) {
        if (value == null) {
            // value is null, return the defaultValue or just null 
            if (defaultValue == null) { return null; }
            return this.DeconstructNumericParam(defaultValue, null);
        }
        // flatten single-value array, or parse to string
        if (Array.isArray(value)) {
            if (value.length == 1) {
                if (typeof value[0] == 'number') {
                    // single-element number array, just return it
                    return [value[0]];
                }
                // flatten and attempt to parse
                value = value[0];
            }
            else {
                // multi-element array, convert to string 
                value = value.toString();
                if (value.startsWith('[')) { value = value.slice(1); }
                if (value.endsWith(']')) { value = value.slice(0, -1); }
            }
        }
        // iterate through value types 
        switch (typeof value) {
            case 'number':
                // number - simply return as-is in an array
                return [value];
            case 'string':
                // string - remove non-numeric chars 
                if (isBlank(value)) { return [value]; } // return value '' in array 
                if (StringContainsNumeric(value)) {
                    // yup, string contains numbers alright 
                    if (StringOnlyNumeric(value)) {
                        // ONLY numbers, convert to number, return in array 
                        return [StringToNumber(value)];
                    }
                    // split into alternating array 
                    return StringNumericDivider(value);
                }
                // non-numeric string, return itself in array
                return [value];
            case 'boolean':
                // boolean value, don't convert it to a 0 or 1, return it as string
                return [value ? 'true' : 'false'];
            default:
                // other type - attempt to coerce to number, or return as string
                const v = Number(value);
                if (v == null || typeof v != 'number' || !Number.isFinite(v)) {
                    return [String(value)]; // invalid number output, return as string 
                }
                return [v];
        }
    } // split '100px' param into [100, 'px'] array 

    /** 
     * Reconstructs a parameter deconstructed by {@link DeconstructNumericParam}
     * @param {([string | number, any?])[]|(string|number)[]|string|number} deconstructedParam Array of a deconstructed parameter  
     * @returns {string} Parameter, reassembled into an appropriate string 
     * @example 
     * ReconstructNumericParam([123]);                           // "123"
     * ReconstructNumericParam(["fit-content"]);                 // "fit-content"
     * ReconstructNumericParam([22.5, "px"]);                    // "22.5px"
     * ReconstructNumericParam(["calc(", 5, "px + ", 10, "%)"]); // "calc(5px + 10%)"
     */
    ReconstructNumericParam(deconstructedParam) {
        if (deconstructedParam == null) { return null; }
        // check if it's a string 
        switch (typeof deconstructedParam) {
            case 'number':
                return deconstructedParam.toMax();
            case 'string':
                // check if it's a string of an array of values 
                if (deconstructedParam.indexOf(',') == -1) {
                    // slice off curly brackets if needed 
                    if (deconstructedParam.startsWith('[') &&
                        deconstructedParam.endsWith(']')) {
                        return deconstructedParam.slice(1, -1);
                    }
                    return deconstructedParam;
                }
                // convert to array, split along commas, convert num strings to nums
                /** @type {(string|number)[]} */
                let dpArray = deconstructedParam.split(',');
                for (let i = 0; i < dpArray.length; i++) {
                    if (StringNumericOnly(dpArray[i])) {
                        dpArray[i] = StringToNumber(dpArray[i]);
                    }
                }
                return this.ReconstructNumericParam(dpArray);
        }
        if (!Array.isArray(deconstructedParam)) {
            console.warn("WARNING: can't reconstruct param that is neither string nor array, returning null", deconstructedParam, this);
            return null;
        }
        // rebuild parameters (aka why just using 'join' won't cut it)
        if (deconstructedParam.length == 0) { return ''; }
        let param = '';
        for (let i = 0; i < deconstructedParam.length; i++) {
            if (deconstructedParam[i] == null) { continue; }
            let dpi = deconstructedParam[i];
            switch (typeof dpi) {
                case 'number':
                    param += dpi.toMax();
                    break;
                case 'string':
                    param += dpi;
                    break;
                default:
                    console.warn(`WARNING: reconstruction param, index ${i} is ${typeof dpi}, should be number or string, parsing to string`, deconstructedParam, this);
                    param += String(dpi);
                    break;
            }
        }
        return param;
    } // rebuild decon param [100, 'px'] back into '100px'

    /**
     * Converts a string to a local URL reference, eg `"url(#myString)"`. 
     * Attempts to convert non-string values to string and format those. 
     * If string is null or empty, returns unmodified input value, eg `""`.
     * @param {string} str String to convert
     * @see {@link stringFromURL} — Extracts a string FROM a URL reference, eg `"myString"` from `"url(#myString)"` 
     * @returns {string}
     */
    stringToURL(str) {
        if (str == null) { return null; }
        if (typeof str != 'string') { return this.stringToURL(String(str)); }
        if (isBlank(str)) { return str; }
        if (this.isURL(str)) { return str; } // already a URL 
        if (str.startsWith('#')) { str = str.slice(1); } // remove to easily reassign below 
        if (!str.startsWith('url(')) { str = `url(#${str}`; } // url(#myString
        if (!str.endsWith(')')) { str = `${str})`; } // url(#myString)
        return str;
    }
    /**
     * Extract inner string from URL-formatted string, eg `"myString"` from `"url(#myString)"` 
     * @param {string} str String to process. If string is not URL formatted (or value is not a string), returns `str` unmodified 
     * @see {@link stringToURL} — Converts a string INTO a URL
     * @see {@link isURL} — Checks if input string is URL formatted or not 
     * @returns {string} 
     */
    stringFromURL(str) {
        if (!this.isURL(str, false, false)) { return str; }
        str = str.trim(); // "url(#myString)" 
        if (str.toLowerCase().startsWith('url')) {
            str = str.slice(3); // "(#myString)" 
            if (str.startsWith('(')) {
                str = str.slice(1); // "#myString)" 
                if (str.startsWith('#')) {
                    str = str.slice(1); // "myString)" 
                }
                if (str.endsWith(')')) {
                    str = str.slice(0, -1); // "myString" 
                }
            }
        }
        return str;
    }
    /** Checks if a given string is formatted as a local URL reference, eg `"url(#myString)"`
     * @param {string} str String to check 
     * @param {boolean} [checkEnd=true] Check end of string for `)`? Default `true
     * @param {boolean} [requireHash=true] Require `#` in `url(#`? Default `true` 
     * @returns {boolean}
     */
    isURL(str, checkEnd = true, requireHash = true) {
        if (!isStringNotBlank(str)) { return false; }
        str = str.toLowerCase();
        if (checkEnd) { if (!str.endsWith(')')) { return false; } }
        return requireHash ? str.startsWith('url(#') : str.startsWith('url(');
    }

    /**
     * gets this element's {@linkcode id ID} formatted as an
     * SVG-attribute URL: `url(#id)`
     */
    get idURL() {
        if (isBlank(this.id)) {
            console.warn("WARNING: can't get id URL from blank/null ID, returning null", this);
            return null;
        }
        return this.stringToURL(this.id);
    }

    /** Gets the name of this specific class constructor, eg `svgGradient` @returns {string} */
    get className() { return this.constructor?.name; }
}
const __svgElementInstance = Symbol('__svgElementInstance');

// #endregion
