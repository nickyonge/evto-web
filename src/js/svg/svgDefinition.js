import { isBlank } from '../lilutils';
import * as svg from './index';

/** 
 * Class representing an SVG definition, typically found in an SVG's `<defs>`
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/defs
 */
export class svgDefinition extends svg.element {

    /** 
     * The type of this definition (aka, what will be put in the `<defs>` tag). 
     * @see https://www.w3.org/TR/SVG2/struct.html#DefsElement — all SVG definition types 
     * @returns {string}
    */
    get defType() { return this.#_defType; }
    set defType(v) {
        if (this.defType == v) { return; }
        let prev = this.#_defType;
        this.#_defType = v;
        if (!this.#_firstTypeAssigned) {
            this.#_firstTypeAssigned = true;
        } else {
            this.#changed('defType', v, prev);
        }
    }
    /** @type {string} */
    #_defType;
    /** local flag for first definition type assignment @type {boolean} */
    #_firstTypeAssigned = false;// use these local flags cuz `null` COULD be a valid assignment

   // TODO: svgDef subDefinitions AddSubDef, RemoveSubDef, Get, Has, etc 
   // Issue URL: https://github.com/nickyonge/evto-web/issues/65

    /** Array of elements contained in this SVG's `<defs>` @type {svg.definition[]} */
    get subDefinitions() {
        if (this.#_subDefinitions == null) { this.#_subDefinitions = []; }
        return this.#_subDefinitions;
    }
    set subDefinitions(v) {
        let prev = this.#_subDefinitions;
        if (v == null) {
            if (svg.config.ARRAY_SET_NULL_CREATES_EMPTY_ARRAY) {
                v = [];
            } else {
                this.#_subDefinitions = null;
                this.#changed('definitions', v, prev);
                return;
            }
        }
        v.forEach(def => {
            def.parent = this;
        });
        this.#_subDefinitions = v;
        this.#_subDefinitions.name = 'definitions';
        this.#_subDefinitions['parent'] = this;
        this.#_subDefinitions.onChange = this.#arrayChanged;
        this.#changed('definitions', v, prev);
    }
    /** @type {svg.definition[]} */
    #_subDefinitions;

    /** Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @returns {Array<[string, any]>} */
    get extraAttributes() {
        if (this.#_extraAttributes == null) { this.#_extraAttributes = []; }
        return this.#_extraAttributes;
    }
    set extraAttributes(v) {
        let prev = this.#_extraAttributes;
        if (v == null) {
            if (svg.config.ARRAY_SET_NULL_CREATES_EMPTY_ARRAY) {
                v = [];
            } else {
                this.#_extraAttributes = null;
                this.#changed('extraAttributes', v, prev);
                return;
            }
        }
        this.#_extraAttributes = v;
        this.#_extraAttributes.name = 'extraAttributes';
        this.#_extraAttributes['parent'] = this;
        this.#_extraAttributes.onChange = this.#arrayChanged;
        this.#changed('extraAttributes', v, prev);
    }
    /** @type {Array<[string, any]>} */
    #_extraAttributes = [];

    /** 
     * SVG parent {@link svg.element svgElement}, assigned by the parent 
     * @returns {svg.element} */
    get parent() { return this.#_parent; }
    set parent(v) {
        if (this.parent == v) { return; }
        let prev = this.#_parent;
        this.#_parent = v;
        if (!this.#_firstParentAssigned) {
            this.#_firstParentAssigned = true;
        } else {
            this.#changed('parent', v, prev);
        }
    }
    /** @type {svg.element} */
    #_parent = null;
    /** local flag for first definition parent assignment @type {boolean} */
    #_firstParentAssigned = false;

    /** 
     * Class representing an SVG definition, typically found in an SVG's `<defs>`
     * @param {string} [id] unique identifier for this element  
     * @param {string?} [defType] Definition type. Must be set, but can be set at any time. 
     * Usually set by the constructor of a subclass inheriting from {@link svgDefinition}.
     * If unassigned, and can't auto-detect, won't be generated in {@linkcode html}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/defs
     */
    constructor(id, defType) {
        super(id);
        this.defType = defType;
    }

    /**
     * Add an attribute to this def's {@linkcode extraAttributes}, or if the attribute already exists, updates its value
     * @param {string|[string,any?]} attribute Either `string` name of the attribute, or `[string, any]` array where `any` is the (optional) value.
     * @param {any?} [value] Optional value of the attribute. Will override a value set in `attribute` if `value` is non-null and `attribute` is a `[string, any?]` array.
     * @param {boolean?} [returnIfAlreadyAdded=true] Value to return if the attribute has already been added to this def. Default `true` 
     * @returns {boolean} `true` if attribute was successfully added, `false` if failed to add, `returnIfAlreadyAdded` if attribute already exists
     */
    AddAttribute(attribute, value = null, returnIfAlreadyAdded = true) {
        if (attribute == null) { return false; }
        // pass array to string/any attribute/value
        if (!Array.isArray(attribute)) {
            attribute = [attribute, value];
        } else {
            if (attribute[0] == null) { return false; }
            if (attribute.length == 1) {
                attribute.push(value);// null/undefined is okay
            } else if (value != null) {
                attribute[1] = value;// non-null value overrides
            }
        }
        let index = this.#attributeIndex(attribute[0]);
        if (index >= 0) {
            this.extraAttributes[index][1] = attribute[1];
            return returnIfAlreadyAdded;
        }
        this.extraAttributes.push(attribute);
        return true;
    }
    /**
     * Removes the given attribute from this def's {@linkcode extraAttributes}.
     * 
     * If the function fails (eg attribute param is `null`), returns `false`.
     * If the attribute isn't found, returns the value of `returnIfNotFound` (default `true`).
     * @param {string|[string,any?]} attribute Attribute to remove, either by name or by `[name:string,value:any?]` array
     * @param {boolean|null|'error'} [returnIfNotFound=true] 
     * Value to return if attribute isn't found. Used for 
     * additional disambiguation between "function has failed" and 
     * "attribute wasn't found" (which typically should still return
     * `true`, as the attribute isn't there all the same.)
     * Setting to the string `"error"` will throw an error. Default `true` 
     * @returns {boolean|null} **Note:** If `returnIfNotFound` is `error`, an Error gets thrown. 
     * This function can only return `true`, `false`, or `null`.
     */
    RemoveAttribute(attribute, returnIfNotFound = true) {
        if (attribute == null) { return false; }
        let index = this.#attributeIndex(attribute);
        if (index == -1) {
            if (returnIfNotFound === 'error') {
                throw new Error(`ERROR: attribute ${attribute} not found on svgDefinition ${this}, can't remove`);
            }
            return returnIfNotFound;
        }
        return this.extraAttributes[index][1];
    }
    /**
     * Gets the value of the given attribute, if it's in {@linkcode extraAttributes}.
     * 
     * If check fails (eg attribute param is `null`), returns `false`.
     * If the attribute isn't found, returns the value of `returnIfNotFound` (default `null`).
     * 
     * **Note:** Even if `attribute` is a `[string,any]` array with a valid value,
     * if it's not found in {@linkcode extraAttributes}, will still return `returnIfNotFound`. 
     * in {@linkcode extraAttributes}
     * @param {string|[string,any?]} attribute Attribute to check, either by name or by `[name:string,value:any?]` array
     * @param {boolean|null|'error'} [returnIfNotFound=null] 
     * Value to return if attribute isn't found. Used for 
     * additional disambiguation between "attribute isn't found" and 
     * "attribute WAS found and it's value was `false`/`null`". 
     * Setting to the string `"error"` will throw an error. Default `null` 
     * @returns {boolean|null} **Note:** If `returnIfNotFound` is `error`, an Error gets thrown. 
     * This function can only return `true`, `false`, or `null`.
     */
    GetAttributeValue(attribute, returnIfNotFound = null) {
        if (attribute == null) { return false; }
        let index = this.#attributeIndex(attribute);
        if (index == -1) {
            if (returnIfNotFound === 'error') {
                throw new Error(`ERROR: attribute ${attribute} not found on svgDefinition ${this}, can't get value`);
            }
            return returnIfNotFound;
        }
        return this.extraAttributes[index][1];
    }
    /**
     * Quick check if the given attribute has been added to this def's {@linkcode extraAttributes}.
     * @param {string|[string,any?]} attribute Attribute to check for, either by name or by `[name:string,value:any?]` array
     * @returns {boolean}
     */
    HasAttribute(attribute) {
        return this.#attributeIndex(attribute) >= 0;
    }
    /**
     * Get the index for the given attribute, if it's found
     * in this definition's {@linkcode extraAttributes} array.
     * 
     * If not, or if `attribute` is null, returns `-1`
     * @param {string|[string,any?]} attribute Attribute to search, either by name or by `[name:string,value:any?]` array
     * @returns {number}
     */
    #attributeIndex(attribute) {
        attribute = this.#attributeName(attribute);
        if (attribute == null) { return -1; }
        let e = this.extraAttributes;
        for (let i = 0; i < e.length; i++) {
            if (e[i][0] == attribute) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets the name property of a given attribute. Conveniently handles 
     * ambiguity between `string` names and `[string,any?]` attributes. 
     * If name can't be found, returns `null`
     * @param {string|[string,any?]} attribute Either `string` name of the attribute, or `[string, any]` array where `any` is the (optional) value.
     * @returns {string}
     */
    #attributeName(attribute) {
        if (attribute = null) { return null; }
        if (Array.isArray(attribute)) {
            if (attribute[0] == null) { return null; }
            return attribute[0];
        }
        return attribute;
    }
    /**
     * Gets the value property of a given attribute. Typically you'd just reference it by name, 
     * but you can pass the same params as you would to {@linkcode AddAttribute}.
     * 
     * **Note:** Does not check existing {@linkcode extraAttributes}. For that, use {@linkcode GetAttributeValue}.
     * @param {string|[string,any?]} attribute Either `string` name of the attribute, or `[string, any]` array where `any` is the (optional) value.
     * @param {any?} [value] Optional value of the attribute. If non-null, will always return this
     * @returns {any}
     */
    #attributeValue(attribute, value) {
        if (value != null) { return value; }
        if (attribute == null) { return null; }
        if (Array.isArray(attribute)) {
            if (attribute.length == 1) { return null; }
            return attribute[1];
        }
        return null;
    }

    /**
     * Creates and outputs the HTML string associated with this
     * definition, including its attributes and any sub definitions.
     * 
     * **Note:** If {@linkcode defType} is null or blank, returns `''`.
     * @returns {string}
     */
    get html() {
        if (svg.config.HTML_WARN_DEFS_NO_ID && isBlank(this.id)) {
            // check if definition lacks an ID 
            console.warn(`WARNING: svgDefinition doesn't have an assigned id value, and won't be able to be externally referenced`, this);
        }
        if (svg.config.HTML_WARN_DEFS_NO_DEFTYPE && isBlank(this.defType)) {
            // check if definition lacks an ID 
            console.warn(`WARNING: svgDefinition doesn't have an assigned definition type (defType), can't produce HTML`, this);
        }
        if (this.subclassHandlesHTML || isBlank(this.defType)) { return ''; }
        let d = this.data;
        let h = `<${this.defType}${isBlank(d) ? '' : ` ${d}`}`;
        // get sub-definitions, minus invalid/null entries 
        let subs = this.subDefinitionsHTML;
        if (isBlank(subs)) {
            h += `${isBlank(d) ? '' : ' '}/>`;
        } else {
            h += `>${subs}</${this.defType}>`;
        }
        return h;
    }
    /**
     * Collects and returns all the data relevant to this asset, 
     * generally to be used in {@linkcode html} to for the final output.
     */
    get data() {
        let d = '';
        // check for and include extraAttributes
        if (this.extraAttributes != null && this.extraAttributes.length > 0) {
            let ea = this.ParseData(this.extraAttributes);
            if (!isBlank(ea)) { d += ea; }
        }
        return d;
    }

    /** Gets the {@linkcode html} of all this definition's {@linkcode subDefinitions} */
    get subDefinitionsHTML() {
        let h = '';
        let subs = [...this.subDefinitions];
        if (subs.length > 0) {
            for (let i = 0; i < subs.length; i++) {
                if (subs[i] == null) { continue; }
                if (!subs[i].isHTMLValid) { subs[i] = null; }
                subs.removeNullValues();
            }
        }
        if (this.subDefinitions.length == 0) {
            return '';
        } else {
            let firstIteration =
                this._subDefinitionIndent == null ||
                this._subDefinitionIndent <= this.#_minSubDefIncrement ||
                Number.isNaN(this._subDefinitionIndent);
            if (firstIteration) {
                this._subDefinitionIndent = this.#_minSubDefIncrement;
            }
            for (let i = 0; i < subs.length; i++) {
                subs[i]._subDefinitionIndent = this._subDefinitionIndent + 1;
                let subHTML = subs[i].html;
                if (!isBlank(subHTML)) {
                    subHTML = this.IndentHTML(subHTML, this._subDefinitionIndent);
                    h += subHTML;
                    if (svg.config.HTML_NEWLINE) { h += '\n'; }
                }
            }
        }
        return h;
    }

    /** absolute minimum increment for sub definitions @type {number} */
    #_minSubDefIncrement = 1;

    /** 
     * Is this definition's {@linkcode html} output valid? 
     * Returns `false` if {@linkcode defType} is unassigned,
     * UNLESS {@linkcode subclassHandlesHTML} is `true`, in
     * which case it's assumed that a subclass is validly
     * handling the HTML output.
     * 
     * **Note:** even if this check returns `true`, reading 
     * `.html` from this definition will still return  `''` 
     * if {@linkcode subclassHandlesHTML} is `true` but the 
     * subclass does NOT have its own `html` override. 
     */
    get isHTMLValid() {
        if (this.subclassHandlesHTML) { return true; }
        if (isBlank(this.defType)) { return false; }
        return true;
    }

    /**
     * Internal-use only. Keeps track of incremental  
     * tab indentation across child definitions.
     * @see {@linkcode svg.config.HTML_INDENT svgConfig.HTML_INDENT}
     * @protected @type {number} */
    _subDefinitionIndent;

    // Local change and bubble-on-change settings 
    /** Should changes to this asset bubble up to its {@link svgGradient.parent parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { let prev = this.#_bubbleOnChange; this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v, prev); }
    #_bubbleOnChange = svg.defaults.BUBBLE_ONCHANGE;

    /** Callback for {@linkplain Array.prototype.onChange onChange} for local arrays. Omitted `parameters` param. @param {string} type type of method called @param {[]} source array object @param {any} returnValue returned value from method */
    #arrayChanged(type, source, returnValue) { if (source.hasOwnProperty('parent')) { source['parent'].#changed?.(`${source.name}#${type}`, source, returnValue); } };
    /** Local changed callback that calls {@link onChange} on this element and (if {@linkcode bubbleOnChange} is `true`) its {@link svgDefinition.parent parent}. @type {svg.onChange} */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }

    // TODO: svg #changed method, and .parent and .bubbleOnChange properties should prolly be part of svgElement 
    // Issue URL: https://github.com/nickyonge/evto-web/issues/63

}