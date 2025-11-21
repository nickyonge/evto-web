import { svgDefaults, svgElement } from "../index";
import { svgDefinition, svgXYWHDefinition } from "./index";

/**
 * Local class used to contain 
 */
class svgFilterDefBase extends svgXYWHDefinition {

    /** @typedef {null|'userSpaceOnUse '|'objectBoundingBox'} svgType_Filter_FilterUnits */
    /** @typedef {null|'userSpaceOnUse '|'objectBoundingBox'} svgType_Filter_PrimitiveUnits */
    /** @typedef {null|'auto'|'sRGB'|'linearRGB'} svgType_Filter_ColorInterpolationFilters */

    /**
     * The filterUnits attribute defines the coordinate system for the attributes 
     * {@linkcode x}, {@linkcode y}, {@linkcode width}, and {@linkcode height}.
     * - **Note:** `XYWH` values are stored in the parent {@linkcode svgXYWHDefinition} class. 
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/filterUnits
     * @returns {svgType_Filter_FilterUnits} */
    get filterUnits() { return this.#_filterUnits; }
    set filterUnits(v) { if (v == this.#_filterUnits) { return; } let prev = this.#_filterUnits; this.#_filterUnits = v; this.changed('filterUnits', v, prev); }
    /** @type {svgType_Filter_FilterUnits} */
    #_filterUnits = svgDefaults.FILTER_FILTERUNITS;

    /**
     * The primitiveUnits attribute specifies the coordinate system 
     * for the various length values within the filter primitives and 
     * for the attributes that define the filter primitive subregion.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/primitiveUnits
     * @returns {svgType_Filter_PrimitiveUnits} */
    get primitiveUnits() { return this.#_primitiveUnits; }
    set primitiveUnits(v) { if (v == this.#_primitiveUnits) { return; } let prev = this.#_primitiveUnits; this.#_primitiveUnits = v; this.changed('primitiveUnits', v, prev); }
    /** @type {svgType_Filter_PrimitiveUnits} */
    #_primitiveUnits = svgDefaults.FILTER_PRIMITIVEUNITS;

    /**
     * The color-interpolation-filters attribute specifies the color 
     * space for imaging operations performed via filter effects.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/color-interpolation-filters
     * @returns {svgType_Filter_ColorInterpolationFilters} */
    get colorInterpolationFilters() { return this.#_colorInterpolationFilters; }
    set colorInterpolationFilters(v) { if (v == this.#_colorInterpolationFilters) { return; } let prev = this.#_colorInterpolationFilters; this.#_colorInterpolationFilters = v; this.changed('colorInterpolationFilters', v, prev); }
    /** @type {svgType_Filter_ColorInterpolationFilters} */
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
     * @param {string} [id=undefined] Unique identifier for this svgElement.  
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
    /** @typedef {FilterPrimitiveReference|null} svgType_Filter_Result */

    /**
     * The `result` attribute defines the assigned name for this filter primitive. 
     * If supplied, then graphics that result from processing this filter primitive 
     * can be referenced by an {@linkcode in} attribute on a subsequent filter primitive 
     * within the same {@linkcode svgFilterDefinition} element. If no value is provided, 
     * the output will only be available for re-use as the implicit input into the next 
     * filter primitive, if it provides no value for its {@linkcode in} attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/result
     * @returns {svgType_Filter_Result}
     */
    get result() { return this.#_result; }
    set result(v) { if (v == this.#_result) { return; } let prev = this.#_result; this.#_result = v; this.changed('result', v, prev); }
    /** @type {svgType_Filter_Result} */
    #_result = svgDefaults.FILTER_PRIMITIVE_RESULT;

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

    /** @typedef {'SourceGraphic'|'SourceAlpha'|'BackgroundImage'|'BackgroundAlpha'|'FillPaint'|'StrokePaint'|FilterPrimitiveReference|null} svgType_Filter_In */

    /**
     * The `in` attribute identifies input for the given filter primitive.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/in
     * @returns {svgType_Filter_In}
     */
    get in() { return this.#_in; }
    set in(v) { if (v == this.#_in) { return; } let prev = this.#_in; this.#_in = v; this.changed('in', v, prev); }
    /** @type {svgType_Filter_In} */
    #_in = svgDefaults.FILTER_PRIMITIVE_IN;

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

    /** @typedef {'SourceGraphic'|'SourceAlpha'|'BackgroundImage'|'BackgroundAlpha'|'FillPaint'|'StrokePaint'|FilterPrimitiveReference|null} svgType_Filter_In2 */

    /**
     * The `in2` attribute identifies the second input for the given filter primitive. 
     * It works exactly like the {@linkcode in} attribute.
     * 
     * You can use only this attribute with the following SVG elements:
     * - `feBlend`
     * - `feComposite`
     * - `feDisplacementMap`
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/in2
     * @returns {svgType_Filter_In2}
     */
    get in2() { return this.#_in2; }
    set in2(v) { if (v == this.#_in2) { return; } let prev = this.#_in2; this.#_in2 = v; this.changed('in2', v, prev); }
    /** @type {svgType_Filter_In2} */
    #_in2 = svgDefaults.FILTER_PRIMITIVE_IN2;

    get data() {
        return [super.data,
        this.ParseData([
            ['in2', this.in2],
        ])].join(' ');
    }

}
/**
 * Parent class for {@linkcode svgFilterFEFuncA}, {@linkcode svgFilterFEFuncB}, 
 * {@linkcode svgFilterFEFuncG}, and {@linkcode svgFilterFEFuncR}. */
class svgFilterFEFunction extends svgFilterPrimitive { constructor(id, defType) { super(id, defType); } }

/** The `<feBlend>` SVG filter primitive composes two objects together ruled by a certain blending mode. 
 * This is similar to what is known from image editing software when blending two layers. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feBlend */
export class svgFilterFEBlend extends svgFilterPrimitiveIn2 {

    /** The mode attribute defines the blending mode.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/mode
     * @returns {blendMode} */
    get mode() { return this.#_mode; }
    set mode(v) { if (v == this.#_mode) { return; } let prev = this.#_mode; this.#_mode = v; this.changed('mode', v, prev); }
    /** @type {blendMode} */
    #_mode = svgDefaults.FILTER_PRIMITIVE_BLEND_MODE;

    /** The `<feBlend>` SVG filter primitive composes two objects together ruled by a certain blending mode. 
     * This is similar to what is known from image editing software when blending two layers. 
     * @param {blendMode} mode The mode attribute defines the blending mode.
     * @param {string} [id]  */
    constructor(mode, id) { super(id, 'Blend'); this.mode = mode; }
    get data() {
        return [super.data,
        this.ParseData(['mode', this.mode])].join(' ');
    }
}
/** The `<feColorMatrix>` SVG filter element changes colors based on a transformation matrix. 
 * Every pixel's color value `[R,G,B,A]` is matrix multiplied by a 5 by 5 color matrix to create new color `[R',G',B',A']`.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feColorMatrix */
export class svgFilterFEColorMatrix extends svgFilterPrimitive {
    /** @typedef {''} svgType_Filter_ */

    constructor(id) { super(id, 'feColorMatrix'); }
}
/** The `<feComponentTransfer>` SVG filter primitive performs color-component-wise remapping of data for each pixel. 
 * It allows operations like brightness adjustment, contrast adjustment, color balance or thresholding.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feComponentTransfer */
export class svgFilterFEComponentTransfer extends svgFilterPrimitive { constructor(id) { super(id, 'feComponentTransfer'); } }
/** The `<feComposite>` SVG filter primitive performs the combination of two input images pixel-wise in image space.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feComposite */
export class svgFilterFEComposite extends svgFilterPrimitive {
    /** @typedef {'over'|'in'|'out'|'atop'|'xor'|'lighter'|'arithmetic'|null} svgType_Filter_Composite_Operator The compositing operation that is to be performed. Default `over` */
    constructor(id) { super(id, 'feComposite'); }
}
/** The `<feConvolveMatrix>` SVG filter primitive applies a matrix convolution filter effect.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feConvolveMatrix */
export class svgFilterFEConvolveMatrix extends svgFilterPrimitive { constructor(id) { super(id, 'feConvolveMatrix'); } }
/** The `<feDiffuseLighting>` SVG filter primitive lights an image using the alpha channel as a bump map.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDiffuseLighting */
export class svgFilterFEDiffuseLighting extends svgFilterPrimitive { constructor(id) { super(id, 'feDiffuseLighting'); } }
/** The `<feDisplacementMap>` SVG filter primitive uses the pixel values from the image from {@linkcode in2} 
 * to spatially displace the image from {@linkcode svgFilterPrimitiveIn.in in}.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap */
export class svgFilterFEDisplacementMap extends svgFilterPrimitiveIn2 { constructor(id) { super(id, 'feDisplacementMap'); } }
/** The `<feDistantLight>` SVG element defines a distant light source that can be used within a lighting filter primitive: 
 * {@linkcode svgFilterFEDiffuseLighting feDiffuseLighting} or {@linkcode svgFilterFESpecularLighting feSpecularLighting}. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDistantLight */
export class svgFilterFEDistantLight extends svgFilterPrimitive { constructor(id) { super(id, 'feDistantLight'); } }
/** The `<feDropShadow>` SVG filter primitive creates a drop shadow of the input image.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDropShadow */
export class svgFilterFEDropShadow extends svgFilterPrimitive { constructor(id) { super(id, 'feDropShadow'); } }
/** The `<feFlood>` SVG filter primitive fills the filter subregion.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feFlood */
export class svgFilterFEFlood extends svgFilterPrimitive { constructor(id) { super(id, 'feFlood'); } }
/** The `<feFuncA>` SVG filter primitive defines the transfer function for the *alpha* component of the 
 * input graphic of its parent {@linkcode svgFilterFEComponentTransfer feComponentTransfer} element.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feFuncA */
export class svgFilterFEFuncA extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncA'); } }
/** The `<feFuncA>` SVG filter primitive defines the transfer function for the *blue* component of the 
 * input graphic of its parent {@linkcode svgFilterFEComponentTransfer feComponentTransfer} element.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feFuncB */
export class svgFilterFEFuncB extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncB'); } }
/** The `<feFuncA>` SVG filter primitive defines the transfer function for the *green* component of the 
 * input graphic of its parent {@linkcode svgFilterFEComponentTransfer feComponentTransfer} element.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feFuncB */
export class svgFilterFEFuncG extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncG'); } }
/** The `<feFuncA>` SVG filter primitive defines the transfer function for the *red* component of the 
 * input graphic of its parent {@linkcode svgFilterFEComponentTransfer feComponentTransfer} element.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feFuncR */
export class svgFilterFEFuncR extends svgFilterFEFunction { constructor(id) { super(id, 'feFuncR'); } }
/** The `<feGaussianBlur>` SVG filter primitive blurs the input image by the amount specified in 
 * {@linkcode stdDeviation}, which defines the bell-curve.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feGaussianBlur */
export class svgFilterFEGaussianBlur extends svgFilterPrimitive {
    get stdDeviation() { return this.#_stdDeviation; }
    set stdDeviation(v) { if (v == this.#_stdDeviation) { return; } let prev = this.#_stdDeviation; this.#_stdDeviation = v; this.changed('mode', v, prev); }
    /** @type {blendMode} */
    #_stdDeviation = null;
    constructor(id) { super(id, 'feGaussianBlur'); }
}
/** The `<feImage>` SVG filter primitive fetches image data from an external source and provides 
 * the pixel data as output (meaning if the external source is an SVG image, it is rasterized.)
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feImage */
export class svgFilterFEImage extends svgFilterPrimitive { constructor(id) { super(id, 'feImage'); } }
/** The `<feMerge>` SVG element allows filter effects to be applied concurrently instead of sequentially.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feMerge */
export class svgFilterFEMerge extends svgFilterPrimitive { constructor(id) { super(id, 'feMerge'); } }
/** 
 * The `<feMergeNode>` SVG takes the result of another filter to be processed by its parent {@linkcode svgFilterFEMerge feMerge}.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feMergeNode */
export class svgFilterFEMergeNode extends svgFilterPrimitive { constructor(id) { super(id, 'feMergeNode'); } }
/** The `<feMorphology>` SVG filter primitive is used to erode or dilate the input image.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feMorphology */
export class svgFilterFEMorphology extends svgFilterPrimitive {
    /** @typedef {'erode'|'dilate'|null} svgType_Filter_Morphology_Operator Defines whether to erode (i.e., thin) or dilate (fatten) the source graphic. Default `erode` */
    constructor(id) { super(id, 'feMorphology'); }
}
/** The `<feOffset>` SVG filter primitive enables offsetting an input image relative to its current position.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feOffset */
export class svgFilterFEOffset extends svgFilterPrimitive { constructor(id) { super(id, 'feOffset'); } }
/** The `<fePointLight>` SVG element defines a light source which allows to create a point light effect. It can be used within a 
 * lighting filter primitive: {@linkcode svgFilterFEDiffuseLighting feDiffuseLighting} or {@linkcode svgFilterFESpecularLighting feSpecularLighting}. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/fePointLight */
export class svgFilterFEPointLight extends svgFilterPrimitive { constructor(id) { super(id, 'fePointLight'); } }
/** The `<feSpecularLighting>` SVG filter primitive lights a source graphic using the alpha channel as a bump map. 
 * The resulting image is an RGBA image based on the light color.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpecularLighting */
export class svgFilterFESpecularLighting extends svgFilterPrimitive { constructor(id) { super(id, 'feSpecularLighting'); } }
/** The `<feSpotLight>` SVG element defines a light source that can be used to create a spotlight effect. It is used within a 
 * lighting filter primitive: {@linkcode svgFilterFEDiffuseLighting feDiffuseLighting} or {@linkcode svgFilterFESpecularLighting feSpecularLighting}. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpotLight */
export class svgFilterFESpotlight extends svgFilterPrimitive { constructor(id) { super(id, 'feSpotlight'); } }
/** The `<feTile>` SVG filter primitive allows to fill a target rectangle with a repeated, tiled pattern of an input image. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTile */
export class svgFilterFETile extends svgFilterPrimitive { constructor(id) { super(id, 'feTile'); } }
/** The `<feTurbulence>` SVG filter primitive creates an image using the Perlin turbulence function. 
 * It allows the synthesis of artificial textures like clouds or marble.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence */
export class svgFilterFETurbulence extends svgFilterPrimitive { constructor(id) { super(id, 'feTurbulence'); } }
