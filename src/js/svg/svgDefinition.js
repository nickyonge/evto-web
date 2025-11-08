import { isBlank } from '../lilutils';
import * as svg from './index';

/** Class representing an SVG defined linear or radial gradient */
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
        // let prev = this.#_type; this.#_type = v; this.#changed('type', v, prev);
    }
    /** @type {string} */
    #_defType;
    /** local flag for first definition type assignment @type {boolean} */
    #_firstTypeAssigned = false;// use these local flags cuz `null` COULD be a valid assignment

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
     * 
     * @param {string} [id] unique identifier for this element  
     * @param {string} [defType] definition type. If unassigned, and can't auto-detect, won't be generated in `html`
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
        // defer to array 
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
        // defer to string/value
        // if (Array.isArray(attribute)) {
        //     if (attribute[0] == null) { return; }
        //     if (value == null && attribute.length >= 2) {
        //         value = attribute[1];
        //     }
        //     attribute = attribute[0];
        // }
        let index = this.#attributeIndex(attribute[0]);
        if (index >= 0) {
            this.extraAttributes[index][1] = attribute[1];
            return returnIfAlreadyAdded;
        }
        this.extraAttributes.push(attribute);
    }
    /**
     * 
     * @param {string|[string,any]} attribute 
     */
    RemoveAttribute(attribute) {

    }
    /**
     * 
     * @param {string|[string,any]} attribute 
     */
    GetAttributeValue(attribute) {

    }
    /**
     * 
     * @param {string|[string,any]} attribute 
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
     * @param {string|[string,any]} attribute 
     * @returns {number}
     */
    #attributeIndex(attribute) {
        if (attribute == null) { return -1; }
        let a;
        if (Array.isArray(attribute)) {
            if (attribute[0] == null) { return -1; }
            a = attribute[0];
        } else { a = attribute; }
        a = typeof attribute === 'string' ? attribute : attribute[0];
        let e = this.extraAttributes;
        for (let i = 0; i < e.length; i++) {
            if (e[i][0] == a) {
                return i;
            }
        }
        return -1;
    }

    // TODO: fill out data/html returns for svgDefinition
    // Issue URL: https://github.com/nickyonge/evto-web/issues/64
    get data() { return ''; }
    get html() { return ''; }

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