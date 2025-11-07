import { isBlank } from '../lilutils';
import * as svg from './index';

/** Class representing an SVG defined linear or radial gradient */
export class svgDefinition extends svg.element {

    /** 
     * The type of this definition (aka, what will be put in the `<defs>` tag). 
     * @see https://www.w3.org/TR/SVG2/struct.html#DefsElement — all SVG definition types 
     * @returns {string}
    */
    get type() { return this.#_type; }
    set type(v) {
        if (this.type == v) { return; }
        let prev = this.#_type;
        this.#_type = v;
        if (!this.#_firstTypeAssigned) {
            this.#changed('type', v, prev);
            this.#_firstTypeAssigned = true;
        }
        // let prev = this.#_type; this.#_type = v; this.#changed('type', v, prev);
    }
    /** @type {string} */
    #_type;
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
            this.#changed('parent', v, prev);
            this.#_firstParentAssigned = true;
        }
    }
    /** @type {svg.asset} */
    #_parent = null;
    /** local flag for first definition parent assignment @type {boolean} */
    #_firstParentAssigned = false;

    /**
     * 
     * @param {string} [id] unique identifier for this element  
     * @param {string} [type] definition type. If unassigned, and can't auto-detect, won't be generated in `html`
     */
    constructor(id, type) {
        super(id);
        if (this instanceof svg.gradient) {
            // note: altho type is set here, data/html generation will be handled by svgGradient 
            this.#_type = this.isRadial ? 'radialGradient' : 'linearGradient';
            if (type != null && type != 'gradient') {
                console.warn(`WARNING: conflicting svg def type ${type} found on svg element instanceof svgGradient. Can't be a gradient AND another type`, this);
                return;
            }
        }
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

}