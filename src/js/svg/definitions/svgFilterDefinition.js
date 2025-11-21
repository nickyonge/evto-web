import { svgDefaults, svgElement } from "../index";
import { svgDefinition, svgXYWHDefinition } from "./index";

/**
 * Local class used to contain 
 */
class svgFilterDefBase extends svgXYWHDefinition {

    /** @typedef {null|'userSpaceOnUse '|'objectBoundingBox'} svgTypeFilterUnits */
    /** @typedef {null|'userSpaceOnUse '|'objectBoundingBox'} svgTypePrimitiveUnits */
    /** @typedef {null|'auto'|'sRGB'|'linearRGB'} svgTypeColorInterpolationFilters */

    /**
     * The filterUnits attribute defines the coordinate system for the attributes 
     * {@linkcode x}, {@linkcode y}, {@linkcode width}, and {@linkcode height}.
     * - **Note:** `XYWH` values are stored in the parent {@linkcode svgXYWHDefinition} class. 
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/filterUnits
     * @returns {svgTypeFilterUnits} */
    get filterUnits() { return this.#_filterUnits; }
    set filterUnits(v) { if (v == this.#_filterUnits) { return; } let prev = this.#_filterUnits; this.#_filterUnits = v; this.changed('filterUnits', v, prev); }
    /** @type {svgTypeFilterUnits} */
    #_filterUnits = svgDefaults.FILTER_FILTERUNITS;

    /**
     * The primitiveUnits attribute specifies the coordinate system 
     * for the various length values within the filter primitives and 
     * for the attributes that define the filter primitive subregion.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/primitiveUnits
     * @returns {svgTypePrimitiveUnits} */
    get primitiveUnits() { return this.#_primitiveUnits; }
    set primitiveUnits(v) { if (v == this.#_primitiveUnits) { return; } let prev = this.#_primitiveUnits; this.#_primitiveUnits = v; this.changed('primitiveUnits', v, prev); }
    /** @type {svgTypePrimitiveUnits} */
    #_primitiveUnits = svgDefaults.FILTER_PRIMITIVEUNITS;

    /**
     * The color-interpolation-filters attribute specifies the color 
     * space for imaging operations performed via filter effects.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/color-interpolation-filters
     * @returns {svgTypeColorInterpolationFilters} */
    get colorInterpolationFilters() { return this.#_colorInterpolationFilters; }
    set colorInterpolationFilters(v) { if (v == this.#_colorInterpolationFilters) { return; } let prev = this.#_colorInterpolationFilters; this.#_colorInterpolationFilters = v; this.changed('colorInterpolationFilters', v, prev); }
    /** @type {svgTypeColorInterpolationFilters} */
    #_colorInterpolationFilters = svgDefaults.FILTER_COLORINTERPOLATIONFILTERS;

    /** Collects and returns all the data relevant to this asset, 
     * generally to be used in html to for the final output. */
    get data() {
        return [super.data,
        this.ParseData([
            ['filterUnits', this.filterUnits],
            ['primitiveUnits', this.primitiveUnits],
            ['color-interpolation-filters', this.colorInterpolationFilters],
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

/**
 * Primitive used as a base class for all SVG filter elements 
 */
export class svgFilterPrimitive extends svgFilterDefBase {

    /** @typedef {string} FilterPrimitiveReference */
    /** @typedef {FilterPrimitiveReference|null} svgTypeResult */

    /**
     * The `result` attribute defines the assigned name for this filter primitive. 
     * If supplied, then graphics that result from processing this filter primitive 
     * can be referenced by an {@linkcode in} attribute on a subsequent filter primitive 
     * within the same {@linkcode svgFilterDefinition} element. If no value is provided, 
     * the output will only be available for re-use as the implicit input into the next 
     * filter primitive, if it provides no value for its {@linkcode in} attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/result
     * @returns {svgTypeResult}
     */
    get result() { return this.#_result; }
    set result(v) { if (v == this.#_result) { return; } let prev = this.#_result; this.#_result = v; this.changed('result', v, prev); }
    /** @type {svgTypeResult} */
    #_result;

    constructor(id, defType) {
        super(id, defType);
    }

    get data() {
        return [super.data,
        this.ParseData([
            ['result', this.result],
        ])].join(' ');
    }

}
/** 
 * Primitive used as a base class for all SVG filter elements 
 * that use the {@linkcode in} attribute. */
export class svgFilterPrimitiveIn extends svgFilterPrimitive {

    /** @typedef {'SourceGraphic'|'SourceAlpha'|'BackgroundImage'|'BackgroundAlpha'|'FillPaint'|'StrokePaint'|FilterPrimitiveReference|null} svgTypeIn */

    /**
     * The `in` attribute identifies input for the given filter primitive.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/in
     * @returns {svgTypeIn}
     */
    get in() { return this.#_in; }
    set in(v) { if (v == this.#_in) { return; } let prev = this.#_in; this.#_in = v; this.changed('in', v, prev); }
    /** @type {svgTypeIn} */
    #_in;

    get data() {
        return [super.data,
        this.ParseData([
            ['in', this.in],
        ])].join(' ');
    }
}
/** 
 * Primitive used as a base class for all SVG filter elements that use the 
 * {@linkcode svgFilterPrimitiveIn.in in} and {@linkcode in2} attributes. */
export class svgFilterPrimitiveIn2 extends svgFilterPrimitive {

    /** @typedef {'SourceGraphic'|'SourceAlpha'|'BackgroundImage'|'BackgroundAlpha'|'FillPaint'|'StrokePaint'|FilterPrimitiveReference|null} svgTypeIn2 */

    /**
     * The `in2` attribute identifies the second input for the given filter primitive. 
     * It works exactly like the {@linkcode in} attribute.
     * 
     * You can use only this attribute with the following SVG elements:
     * - `feBlend`
     * - `feComposite`
     * - `feDisplacementMap`
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/in2
     * @returns {svgTypeIn2}
     */
    get in2() { return this.#_in2; }
    set in2(v) { if (v == this.#_in2) { return; } let prev = this.#_in2; this.#_in2 = v; this.changed('in2', v, prev); }
    /** @type {svgTypeIn2} */
    #_in2;

    get data() {
        return [super.data,
        this.ParseData([
            ['in2', this.in2],
        ])].join(' ');
    }

}

class svgFilterFEFunction extends svgFilterPrimitive { constructor(id, defType) { super(id, defType); } }

export class svgFilterFEBlend extends svgFilterPrimitiveIn2 {
    constructor(id) { super(id, 'Blend'); }
}
export class svgFilterFEColorMatrix extends svgFilterPrimitive { constructor(id) { super(id, 'feColorMatrix'); } }
export class svgFilterFEComponentTransfer extends svgFilterPrimitive { constructor(id) { super(id, 'feComponentTransfer'); } }
export class svgFilterFEComposite extends svgFilterPrimitive { constructor(id) { super(id, 'feComposite'); } }
export class svgFilterFEConvolveMatrix extends svgFilterPrimitive { constructor(id) { super(id, 'feConvolveMatrix'); } }
export class svgFilterFEDiffuseLighting extends svgFilterPrimitive { constructor(id) { super(id, 'feDiffuseLighting'); } }
export class svgFilterFEDisplacementMap extends svgFilterPrimitive { constructor(id) { super(id, 'feDisplacementMap'); } }
export class svgFilterFEDistantLight extends svgFilterPrimitive { constructor(id) { super(id, 'feDistantLight'); } }
export class svgFilterFEDropShadow extends svgFilterPrimitive { constructor(id) { super(id, 'feDropShadow'); } }
export class svgFilterFEFlood extends svgFilterPrimitive { constructor(id) { super(id, 'feFlood'); } }
export class svgFilterFEFuncA extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncA'); } }
export class svgFilterFEFuncB extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncB'); } }
export class svgFilterFEFuncG extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncG'); } }
export class svgFilterFEFuncR extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncR'); } }
export class svgFilterFEGaussianBlur extends svgFilterPrimitive { constructor(id) { super(id, 'feGaussianBlur'); } }
export class svgFilterFEImage extends svgFilterPrimitive { constructor(id) { super(id, 'feImage'); } }
export class svgFilterFEMerge extends svgFilterPrimitive { constructor(id) { super(id, 'feMerge'); } }
export class svgFilterFEMergeNode extends svgFilterPrimitive { constructor(id) { super(id, 'feMergeNode'); } }
export class svgFilterFEMorphology extends svgFilterPrimitive { constructor(id) { super(id, 'feMorphology'); } }
export class svgFilterFEOffset extends svgFilterPrimitive { constructor(id) { super(id, 'feOffset'); } }
export class svgFilterFEPointLight extends svgFilterPrimitive { constructor(id) { super(id, 'fePointLight'); } }
export class svgFilterFESpecularLighting extends svgFilterPrimitive { constructor(id) { super(id, 'feSpecularLighting'); } }
export class svgFilterFESpotlight extends svgFilterPrimitive { constructor(id) { super(id, 'feSpotlight'); } }
export class svgFilterFETile extends svgFilterPrimitive { constructor(id) { super(id, 'feTile'); } }
