import { svgDefinition, svgDefaults } from "./index";

// other SVG definitions (elements)
// see: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element 

export class svgImageDef extends svgDefinition {

    /**
     * 
     * @param {string} id 
     */
    constructor(id = undefined) {
        super(id, 'image');
    }

}

export class svgMaskDef extends svgDefinition {

    /**
     * The `maskUnits` attribute indicates which coordinate system 
     * to use for the geometry properties of the `<mask>` element.
     * @returns {'userSpaceOnUse'|'objectBoundingBox'|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskUnits
     */
    get maskUnits() { return this.#_maskUnits; }
    set maskUnits(v) { this.#_maskUnits = v; }
    /** @type {'userSpaceOnUse'|'objectBoundingBox'|null} */
    #_maskUnits = svgDefaults.MASK_MASKUNITS;

    /**
     * 
     * @param {string} id 
     */
    constructor(id = undefined) {
        super(id, 'mask');
    }

}