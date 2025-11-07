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
    get subDefinitions() { return this.#_subDefinitions; }
    set subDefinitions(v) {
        if (v == null) { return; }
        let prev = this.#_subDefinitions;
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
    #_subDefinitions = [];

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