import { svgDefaults, svgElement } from "../index";
import { svgDefinition, svgXYWHDefinition } from "./index";

/**
 * Local class used to contain 
 */
class svgFilterDefBase extends svgXYWHDefinition {
    

    /**
     * The filterUnits attribute defines the coordinate system for the attributes 
     * {@linkcode x}, {@linkcode y}, {@linkcode width}, and {@linkcode height}.
     * - **Note:** `XYWH` values are stored in the parent {@linkcode svgXYWHDefinition} class. 
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/filterUnits
     * @returns {null|'userSpaceOnUse '|'objectBoundingBox'} */
    get filterUnits() { return this.#_filterUnits; }
    set filterUnits(v) { if (v == this.#_filterUnits) { return; } let prev = this.#_filterUnits; this.#_filterUnits = v; this.changed('filterUnits', v, prev); }
    /** @type {null|'userSpaceOnUse '|'objectBoundingBox'} */
    #_filterUnits = svgDefaults.FILTER_FILTERUNITS;

    /**
     * The primitiveUnits attribute specifies the coordinate system 
     * for the various length values within the filter primitives and 
     * for the attributes that define the filter primitive subregion.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/primitiveUnits
     * @returns {null|'userSpaceOnUse '|'objectBoundingBox'} */
    get primitiveUnits() { return this.#_primitiveUnits; }
    set primitiveUnits(v) { if (v == this.#_primitiveUnits) { return; } let prev = this.#_primitiveUnits; this.#_primitiveUnits = v; this.changed('primitiveUnits', v, prev); }
    /** @type {null|'userSpaceOnUse '|'objectBoundingBox'} */
    #_primitiveUnits = svgDefaults.FILTER_PRIMITIVEUNITS;

    /**
     * The color-interpolation-filters attribute specifies the color 
     * space for imaging operations performed via filter effects.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/color-interpolation-filters
     * @returns {null|'auto'|'sRGB'|'linearRGB'} */
    get colorInterpolationFilters() { return this.#_colorInterpolationFilters; }
    set colorInterpolationFilters(v) { if (v == this.#_colorInterpolationFilters) { return; } let prev = this.#_colorInterpolationFilters; this.#_colorInterpolationFilters = v; this.changed('colorInterpolationFilters', v, prev); }
    /** @type {null|'auto'|'sRGB'|'linearRGB'} */
    #_colorInterpolationFilters = svgDefaults.FILTER_COLORINTERPOLATIONFILTERS;

    /** Collects and returns all the data relevant to this asset, 
     * generally to be used in html to for the final output. */
    get data() {
        return [super.data,
        this.ParseData([
            ['filterUnits', this.filterUnits],
            ['primitiveUnits', this.primitiveUnits],
            ['color-interpolation-filters', this.colorInterpolationFilters],
            ['filterUnits', this.filterUnits],
        ])].join(' ');
    }
}

/**
 * Container for an {@linkcode svgDefinition} that's 
 * used as a `<filter>` element.
 */
export class svgFilterDefinition extends svgFilterDefBase {
    /**
     * Container for an {@linkcode svgDefinition} that's 
     * used as a `<filter>` element.
     * @param {string} id Unique identifier for this svgElement.  
     * 
     * Every svgElement must have a unique ID, but they 
     * will be automatically generated if not manually 
     * assigned in the constructor.
     */
    constructor(id = undefined) {
        super(id, 'filter');
    }
}

export class svgFilterPrimitive extends svgFilterDefBase {

    /** @typedef {null|'test'|'test2'|string} svgFilterPrimitiveIn */

    /**
     * @returns {svgFilterPrimitiveIn}
     */
    get in() { return this.#_in; }
    set in(v) { if (v == this.#_in) { return; } let prev = this.#_in; this.#_in = v; this.changed('in', v, prev); }
    /** @type {svgFilterPrimitiveIn} */
    #_in;

} 