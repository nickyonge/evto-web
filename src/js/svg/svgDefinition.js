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

    /** 
     * SVG parent {@link svg.asset asset}, assigned by the parent 
     * @returns {svg.asset} */
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
    /** @type {svg.asset} */
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


    get data() { return ''; }
    get html() { return ''; }

    // Local change and bubble-on-change settings 
    /** Should changes to this asset bubble up to its {@link svgGradient.parent parent} asset? @type {boolean} */
    get bubbleOnChange() { return this.#_bubbleOnChange; }
    set bubbleOnChange(v) { let prev = this.#_bubbleOnChange; this.#_bubbleOnChange = v; this.#changed('bubbleOnChange', v, prev); }
    #_bubbleOnChange = svg.defaults.BUBBLE_ONCHANGE;

    /** Local changed callback that calls {@link onChange} on this element and (if {@linkcode bubbleOnChange} is `true`) its {@link svgDefinition.parent parent}. @type {svg.onChange} */
    #changed(valueChanged, newValue, previousValue) { if (this.__suppressOnChange) { return; } this.__invokeChange(valueChanged, newValue, previousValue, this); if (this.bubbleOnChange) { this.parent?.__invokeChange(valueChanged, newValue, previousValue, this); } }

    // TODO: svg #changed method, and .parent and .bubbleOnChange properties should prolly be part of svgElement 
    // Issue URL: https://github.com/nickyonge/evto-web/issues/63

}