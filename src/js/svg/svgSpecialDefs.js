import { svgDefinition, svgDefaults, svgElement, svgHTMLAsset, svgViewBox, svgRect, svgGradient, svgConfig } from "./index";
import { isBlank, IsStringColor } from "../lilutils";

// other SVG definitions (elements)
// see: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element

// #region XYWH Def 

/** Should a warning be output when trying to set XYWH on an 
 * {@linkcode svgXYWHDefinition} that has its 
 * {@linkcode svgXYWHDefinition.matchViewboxXYWH matchViewboxXYWH}
 * value set to `true`? Default `true` */
const WARNING_SET_XYWH_ON_XYWH_MATCHED_DEF = true;

/**
 * Container for an {@linkcode svgDefinition} that has
 * `x`, `y`, `width`, and `height` (XYWH) properties 
 */
export class svgXYWHDefinition extends svgDefinition {

    /** 
     * Should this definition's {@linkcode x}, {@linkcode y}, 
     * {@linkcode width}, and {@linkcode height} values match that 
     * of the {@linkcode svgViewBox viewbox} on the parent {@linkcode svgHTMLAsset}?
     * @returns {boolean} */
    get matchViewboxXYWH() { return this.#_matchViewboxXYWH; }
    set matchViewboxXYWH(v) {
        let prev = this.#_matchViewboxXYWH; this.#_matchViewboxXYWH = v; this.changed('matchViewboxXYWH', v, prev);
        if (v) { this._updateXYWH(); }
    }
    /** @type {boolean} */
    #_matchViewboxXYWH = svgDefaults.XYWHDEF_MATCHVIEWBOX;

    /**
     * Should this definition's {@linkcode x}, {@linkcode y}, 
     * {@linkcode width}, and {@linkcode height} values be 
     * included while exporting this def's {@linkcode html}?
     * 
     * If value is a boolean, it's straightfoward. 
     * 
     * If value is `null`, same as `false`.
     * 
     * If value is a string (case sensitive), corresponding `data` output is:
     * - `xyOnly`: only `x` and `y`
     * - `whOnly` / `widthHeightOnly`: only `width` and `height`
     * - `xywh` / `all`: `x`, `y`, `width`, and `height` (same as `true`)
     *   - Any subset of these characters will use only the 
     *     assocaited values. Eg, `yh` will use `y` and `height`.
     * - `x`, `y`, `w` / `width`, or `h`/`height`: only that value 
     * - `none`: no values, same as `false`
     * @returns {boolean | 'all' | 'xyOnly' | 'whOnly' | 'widthHeightOnly' | 'xywh' | 'xyw' | 'xyh' | 'xwh' | 'xy' | 'xw' | 'xh' | 'wh' | 'ywh' | 'yw' | 'yh' | 'wh' | 'x' | 'y' | 'w' | 'h' | 'width' | 'height' | `none` } */
    get includeXYWHInData() { return this.#_includeXYWHInData; }
    set includeXYWHInData(v) { let prev = this.#_includeXYWHInData; this.#_includeXYWHInData = v; this.changed('includeXYWHInData', v, prev); }
    /** @type {boolean | 'all' | 'xyOnly' | 'whOnly' | 'widthHeightOnly' | 'xywh' | 'xyw' | 'xyh' | 'xwh' | 'xy' | 'xw' | 'xh' | 'wh' | 'ywh' | 'yw' | 'yh' | 'wh' | 'x' | 'y' | 'w' | 'h' | 'width' | 'height' | `none` } */
    #_includeXYWHInData = svgDefaults.XYWHDEF_INCLUDEXYWHNDATA;

    /** Get the `x` value of this definition. If {@linkcode matchViewboxXYWH} is `true`, this has no affect, as the value wll be read from a parent {@linkcode svgViewBox} (if one exists). @returns {number} */
    get x() { return this.#_x; }
    set x(v) {
        if (this.matchViewboxXYWH && this.rootHTMLAsset != null) {
            if (WARNING_SET_XYWH_ON_XYWH_MATCHED_DEF) { console.warn(`WARNING: Can't set X to ${v} on svgXYWHDefinition with matchViewboxXYWH enabled.`, this); }
            return;
        }
        let prev = this.#_x; this.#_x = v; this.changed('x', v, prev);
    }
    /** @type {number} */
    #_x = svgDefaults.X;
    /** Get the `y` value of this definition. If {@linkcode matchViewboxXYWH} is `true`, this has no affect, as the value wll be read from a parent {@linkcode svgViewBox} (if one exists). @returns {number} */
    get y() { return this.#_y; }
    set y(v) {
        if (this.matchViewboxXYWH && this.rootHTMLAsset != null) {
            if (WARNING_SET_XYWH_ON_XYWH_MATCHED_DEF) { console.warn(`WARNING: Can't set Y to ${v} on svgXYWHDefinition with matchViewboxXYWH enabled.`, this); }
            return;
        }
        let prev = this.#_y; this.#_y = v; this.changed('y', v, prev);
    }
    /** @type {number} */
    #_y = svgDefaults.Y;
    /** Get the `width` value of this definition. If {@linkcode matchViewboxXYWH} is `true`, this has no affect, as the value wll be read from a parent {@linkcode svgViewBox} (if one exists). @returns {number} */
    get width() { return this.#_width; }
    set width(v) {
        if (this.matchViewboxXYWH && this.rootHTMLAsset != null) {
            if (WARNING_SET_XYWH_ON_XYWH_MATCHED_DEF) { console.warn(`WARNING: Can't set WIDTH to ${v} on svgXYWHDefinition with matchViewboxXYWH enabled.`, this); }
            return;
        }
        let prev = this.#_width; this.#_width = v; this.changed('width', v, prev);
    }
    /** @type {number} */
    #_width = svgDefaults.WIDTH;
    /** Get the `height` value of this definition. If {@linkcode matchViewboxXYWH} is `true`, this has no affect, as the value wll be read from a parent {@linkcode svgViewBox} (if one exists). @returns {number} */
    get height() { return this.#_height; }
    set height(v) {
        if (this.matchViewboxXYWH && this.rootHTMLAsset != null) {
            if (WARNING_SET_XYWH_ON_XYWH_MATCHED_DEF) { console.warn(`WARNING: Can't set HEIGHT to ${v} on svgXYWHDefinition with matchViewboxXYWH enabled.`, this); }
            return;
        }
        let prev = this.#_height; this.#_height = v; this.changed('height', v, prev);
    }
    /** @type {number} */
    #_height = svgDefaults.HEIGHT;

    /** 
     * Class representing an SVG definition, typically found in an SVG's `<defs>`.
     * - Includes {@linkcode x}, {@linkcode y}, {@linkcode width}, and {@linkcode height}
     *   (XYWH) values, and syncs those values to the {@linkcode svgViewBox viewbox} 
     *   on the parent {@linkcode svgHTMLAsset} if {@linkcode matchViewboxXYWH} is `true`.
     * @param {string} [id] Unique identifier for this element (see {@linkcode svgElement.id}). If blank/omitted, sets to {@linkcode svgElement.uniqueID}. 
     * @param {string?} [defType] Definition type. Must be set, but can be set at any time. 
     * Usually set by the constructor of a subclass inheriting from {@link svgDefinition}.
     * If unassigned, and can't auto-detect, won't be generated in {@linkcode html}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/defs
     */
    constructor(id = undefined, defType = undefined) {
        super(id, defType);
        this.AddOnChangeCallback(this.onAssetChanged);
        // initial attempt to match to viewbox 
        if (this.parent != null) { this._updateXYWH(); }
    }

    get data() {
        if (this.includeXYWHInData == null || this.includeXYWHInData == false || this.includeXYWHInData == 'none') { return super.data; }
        let xywh = { x: false, y: false, w: false, h: false };
        if (typeof this.includeXYWHInData === 'boolean') {
            // must be true
            xywh.x = true; xywh.y = true; xywh.w = true; xywh.h = true;
        } else {
            // must be string 
            switch (this.includeXYWHInData) {
                case 'all':
                case 'xywh':
                    xywh.x = true; xywh.y = true; xywh.w = true; xywh.h = true;
                    break;
                case 'xy':
                case 'xyOnly':
                    xywh.x = true; xywh.y = true;
                    break;
                case 'wh':
                case 'whOnly':
                case 'widthHeightOnly':
                    xywh.w = true; xywh.h = true;
                    break;
                case 'w':
                case 'width':
                    xywh.w = true;
                    break;
                case 'h':
                case 'height':
                    xywh.h = true;
                    break;
                default:
                    xywh.x = this.includeXYWHInData.indexOf('x') >= 0;
                    xywh.y = this.includeXYWHInData.indexOf('y') >= 0;
                    xywh.w = this.includeXYWHInData.indexOf('w') >= 0;
                    xywh.h = this.includeXYWHInData.indexOf('h') >= 0;
                    break;
            }
        }
        if (xywh.x == false && xywh.y == false && xywh.w == false && xywh.h == false) { return super.data; }
        /** @type {[string, any?][]} */
        let dataToParse = [];
        if (xywh.x) { dataToParse.push(['x', this.x]); }
        if (xywh.y) { dataToParse.push(['y', this.y]); }
        if (xywh.w) { dataToParse.push(['width', this.width]); }
        if (xywh.h) { dataToParse.push(['height', this.height]); }
        if (dataToParse.length == 0) { return super.data; }
        return [super.data, this.ParseData(dataToParse)].join(' ');
    }

    onAssetChanged(valueChanged, newValue, previousValue, _changedElement) {
        switch (valueChanged) {
            case 'parent':
                // new parent, first, remove onChange callback if found 
                if (previousValue != null && previousValue instanceof svgElement) {
                    if (previousValue.HasOnChangeCallback(this.onAssetChanged)) {
                        previousValue.RemoveOnChangeCallback(this.onAssetChanged);
                    }
                }
                // add onChange callback to new parent's HTML asset 
                if (newValue != null) {
                    if (newValue instanceof svgElement) {
                        let htmlAsset = newValue.rootHTMLAsset;
                        if (htmlAsset != null) {
                            htmlAsset.AddOnChangeCallback(this.XYWHUpdateCallback);
                            htmlAsset.viewBox?.AddOnChangeCallback(this.XYWHUpdateCallback);
                        }
                    } else {
                        console.warn("New parent assigned to svgXYWHDefinition is somehow NOT an svgElement? Investigate", newValue, this);
                        return;
                    }
                }
                this._updateXYWH();
                break;
        }
    }

    XYWHUpdateCallback(valueChanged, newValue, previousValue, changedElement) {
        if (changedElement instanceof svgHTMLAsset) {
            // HTML asset changed 
            switch (valueChanged) {
                case 'viewbox':
                    let p = /** @type {svgViewBox} */ (previousValue);
                    if (p != null) {
                        if (p.HasOnChangeCallback(this.XYWHUpdateCallback)) {
                            p.RemoveOnChangeCallback(this.XYWHUpdateCallback);
                        }
                    }
                    let n = /** @type {svgViewBox} */ (newValue);
                    if (n != null) {
                        n.AddOnChangeCallback(this.XYWHUpdateCallback);
                        this._updateXYWH(n);
                    }
                    break;
            }
        } else if (changedElement instanceof svgViewBox) {
            // viewbox asset changed 
            switch (valueChanged) {
                case 'x':
                case 'y':
                case 'width':
                case 'height':
                    this._updateXYWH(changedElement);
                    break;
            }
        }
    }

    /**
     * Update this asset's XYWH based on the given {@linkcode svgViewBox}.
     * 
     * If {@linkcode viewbox} is `null`, attempts to find it using
     * {@linkcode svgElement.rootHTMLAsset}, via {@linkcode _getViewbox}. 
     * 
     * **Note:** If {@linkcode matchViewboxXYWH} is `false`, does nothing.
     * @param {svgViewBox} [viewbox] 
     * @private
     */
    _updateXYWH(viewbox) {
        if (!this.matchViewboxXYWH) { return; }
        if (viewbox == null) {
            viewbox = this._getViewbox;
            if (viewbox == null) { return; }
        }
        // set local stores, because
        // 1) we don't want to trigger onChange, and 
        // 2) we don't want matchViewboxXYWH to catch 
        this.#_x = viewbox.x;
        this.#_y = viewbox.y;
        this.#_width = viewbox.width;
        this.#_height = viewbox.height;
    }

    /** 
     * Get the locally referenced {@linkcode svgViewBox}, 
     * or `null` if not found 
     * @returns {svgViewBox|null} 
     */
    get _getViewbox() {
        return this.rootHTMLAsset?.viewBox;
    }
}

// #endregion XYWH Def 

// #region Img/Mask 

/**
 * Container for an {@linkcode svgDefinition} that's 
 * used as a `<image>` element in HTML, used for including
 * images inside an SVG asset.
 * - **Note:** supports `JPEG` / `JPG`, `PNG`, and other `SVG` files.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/image
 */
export class svgImageDefinition extends svgXYWHDefinition {

    /**
     * The URL of the image file to display.
     * @returns {string|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskUnits
     */
    get href() { return this.#_href; }
    set href(v) { let prev = this.#_href; this.#_href = v; this.changed('href', v, prev); }
    /** @type {string|null} */
    #_href = svgDefaults.IMAGE_HREF;

    /**
     * Indicates how an element with a viewBox providing 
     * a given aspect ratio must fit into a viewport with 
     * a different aspect ratio. 
     * 
     * - **Note:** If using a boolean, `false` exports to `"none"`,
     * and `true` exports to the default value `"xMidYMid meet"` 
     * during {@linkcode html} output. As with all other SVG 
     * attribute properties, `null` / `undefined` simply disables export. 
     * - **Note:** {@linkcode svgDefaults.IMAGE_PRESERVEASPECTRATIO}
     * is this property's default value. This value is distinct from 
     * {@linkcode svgDefaults.PRESERVEASPECTRATIO}.
     * @returns {boolean|'none'|`x${'Min'|'Mid'|'Max'}Y${'Min'|'Mid'|'Max'} ${'meet'|'slice'}`|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskUnits
    */
    get preserveAspectRatio() { return this.#_preserveAspectRatio; }
    set preserveAspectRatio(v) { let prev = this.#_preserveAspectRatio; this.#_preserveAspectRatio = v; this.changed('preserveAspectRatio', v, prev); }
    /** @type {boolean|'none'|`x${'Min'|'Mid'|'Max'}Y${'Min'|'Mid'|'Max'} ${'meet'|'slice'}`|null} */
    #_preserveAspectRatio = svgDefaults.IMAGE_PRESERVEASPECTRATIO;

    /**
     * Provides support for configuration of the Cross-Origin 
     * Resource Sharing (CORS) requests for the element's fetched data.
     * @returns {'anonymous'|'use-credentials'|''|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/crossorigin 
     */
    get crossorigin() { return this.#_crossorigin; }
    set crossorigin(v) { let prev = this.#_crossorigin; this.#_crossorigin = v; this.changed('crossorigin', v, prev); }
    /** @type {'anonymous'|'use-credentials'|''|null} */
    #_crossorigin = svgDefaults.IMAGE_CROSSORIGIN;

    /**
     * Provides a hint to the browser as to whether it should 
     * perform image decoding synchronously or asynchronously.
     * @returns {'async '|'sync'|'auto'|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/decoding 
     */
    get decoding() { return this.#_decoding; }
    set decoding(v) { let prev = this.#_decoding; this.#_decoding = v; this.changed('decoding', v, prev); }
    /** @type {'async '|'sync'|'auto'|null} */
    #_decoding = svgDefaults.IMAGE_DECODING;

    // not including fetchpriority - at time of coding this, it's labeled as experimental / non-standard
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fetchpriority 

    // not including xlink:href - at time of coding this, it's deprecated 
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/xlink:href 

    /** 
     * Optional `mask` attribute for this image, typically used
     * in conjunction with {@linkcode svgMaskDefinition}.
     * 
     * Can be set to either a `string` that should reference the
     * {@link svgMaskDefinition.id ID} or 
     * {@link svgMaskDefinition.idURL URL} of a mask, or you can 
     * directly set to an {@linkcode svgMaskDefinition}. In that 
     * case, it'll return {@linkcode svgMaskDefinition.idURL}.
     * @returns {string} 
     */
    get mask() {
        if (this.#_mask instanceof svgMaskDefinition) {
            return this.#_mask.idURL;
        }
        return this.#_mask;
    }
    /** 
     * @param {string|svgMaskDefinition} v 
     * Either a `string` that should reference the 
     * {@link svgMaskDefinition.id ID} or 
     * {@link svgMaskDefinition.idURL URL} of a mask, or an 
     * {@linkcode svgMaskDefinition} to read the 
     * {@linkcode svgMaskDefinition.idURL} value of. */
    set mask(v) { let prev = this.#_mask; this.#_mask = v; this.changed('mask', v, prev); }
    /** @type {string|svgMaskDefinition} */
    #_mask;

    /**
     * Container for an {@linkcode svgDefinition} that's 
     * used as a `<image>` element in HTML, used for including
     * images inside an SVG asset.
     * - **Note:** supports `JPEG` / `JPG`, `PNG`, and other `SVG` files.
     * @param {string} urlToImage URL path to the image to display  
     * @param {string} [id] Unique identifier for this element (see {@linkcode svgElement.id}). If blank/omitted, sets to {@linkcode svgElement.uniqueID}. 
     */
    constructor(urlToImage, id = undefined) {
        super(id, 'image');
        this.storeInDefsElement = false;
        this.href = urlToImage;
    }

    get data() {
        return [super.data, this.ParseData([
            ['href', this.href],
            ['preserveAspectRatio', this.preserveAspectRatio],
            ['crossorigin', this.crossorigin],
            ['decoding', this.decoding],
            ['mask', this.mask],
        ])].join(' ');
    }
}

/**
 * Container for an {@linkcode svgDefinition} that's 
 * used as a `<mask>` element in HTML, generally used  
 * for alpha-masking an image (such as by using 
 * {@linkcode svgImageDefinition}) or another SVG. 
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/mask
 */
export class svgMaskDefinition extends svgXYWHDefinition {

    /**
     * The `maskUnits` attribute indicates which coordinate system 
     * to use for the geometry properties of the `<mask>` element.
     * @returns {'userSpaceOnUse'|'objectBoundingBox'|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskUnits
     */
    get maskUnits() { return this.#_maskUnits; }
    set maskUnits(v) { let prev = this.#_maskUnits; this.#_maskUnits = v; this.changed('maskUnits', v, prev); }
    /** @type {'userSpaceOnUse'|'objectBoundingBox'|null} */
    #_maskUnits = svgDefaults.MASK_MASKUNITS;

    /**
     * The `maskContentUnits` attribute indicates which coordinate 
     * system to use for the contents of the `<mask>` element.
     * @returns {'userSpaceOnUse'|'objectBoundingBox'|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskContentUnits
     */
    get maskContentUnits() { return this.#_maskContentUnits; }
    set maskContentUnits(v) { let prev = this.#_maskContentUnits; this.#_maskContentUnits = v; this.changed('maskContentUnits', v, prev); }
    /** @type {'userSpaceOnUse'|'objectBoundingBox'|null} */
    #_maskContentUnits = svgDefaults.MASK_MASKCONTENTUNITS;

    /**
     * The `maskContentUnits` attribute indicates which coordinate 
     * system to use for the contents of the `<mask>` element.
     * @returns {'alpha'|'luminance'|null}
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/maskType
     */
    get maskType() { return this.#_maskType; }
    set maskType(v) { let prev = this.#_maskType; this.#_maskType = v; this.changed('maskType', v, prev); }
    /** @type {'alpha'|'luminance'|null} */
    #_maskType = svgDefaults.MASK_MASKTYPE;

    /** 
     * Should this mask auto-generate a `<rect>` based on its XYWH values,
     * or (if {@linkcode matchViewboxXYWH} is `true`, its parent 
     * {@linkcode svgViewBox}? Default {@linkcode svgDefaults.MASK_AUTOGENERATERECT}
     * - **Note:** the rect will need to use a fill value, assigned by
     * {@linkcode autoGenerateRectFill}. It can be a color (`"#ff0000"`), 
     * string URL referencing a gradient (see {@linkcode isURL}), 
     * {@linkcode svgGradient}, string color array to generate a new 
     * gradient, or `null`. If `null`, generates a new gradient using 
     * the gradient template {@linkcode svgGradient.templates.bw}
     * - **Note:** If `true`, during `html` generation, the property 
     * {@linkcode subclassHandlesHTML} is forced to `true`, with its 
     * previous value being reassigned afterward. 
     * @returns {boolean} */
    get autoGenerateRect() { return this.#_autoGenerateRect; }
    set autoGenerateRect(v) {
        let prev = this.#_autoGenerateRect; this.#_autoGenerateRect = v; this.changed('autoGenerateRect', v, prev);
    }
    /** @type {boolean} */
    #_autoGenerateRect = svgDefaults.MASK_AUTOGENERATERECT;


    /** 
     * The URL of the fill value used if a rect is autogenerated
     * for this mask, via {@linkcode autoGenerateRect}. 
     * 
     * It can be a color (`"#ff0000"`), {@linkcode svgGradient}, 
     * string URL referencing a gradient (see {@linkcode isURL}), 
     * string color array to generate a new gradient, or `null`. 
     * If `null`, generates a new gradient using the 
     * gradient template {@linkcode svgGradient.templates.bw}
     * 
     * Returns the ID-ref URL of the fill value, or `null` if error.
     * - **Note:** This getter returns the ID-ref URL of the fill. 
     * To get the fill itself, use {@linkcode autoGenerateRectFill}.
     * - **Note:** This getter will auto-generate the 
     * {@linkcode #_autoGradient} reference if it's needed, which 
     * then gets cleared during the {@linkcode html} generation. 
     * @returns {string} */
    get autoGenerateRectFillURL() {
        if (this.#_autoGenerateRectFill == null) {
            this.#_autoGradient = new svgGradient(svgGradient.templates.bw);
            this.#_autoGradient.skipNextOnChangeForID = true;
            this.#_autoGradient.id = this.#_getAutoID(true);
            return this.#_autoGradient.idURL;
        }
        if (this.#_autoGenerateRectFill instanceof svgGradient) {
            this.#_autoGradient = this.#_autoGenerateRectFill;
            return this.#_autoGradient.idURL;
        }
        if (Array.isArray(this.#_autoGenerateRectFill)) {
            this.#_autoGradient = new svgGradient(this.#_autoGenerateRectFill);
            this.#_autoGradient.skipNextOnChangeForID = true;
            this.#_autoGradient.id = this.#_getAutoID(true);
            return this.#_autoGradient.idURL;
        }
        if (this.isURL(this.#_autoGenerateRectFill) || IsStringColor(this.#_autoGenerateRectFill)) {
            return this.#_autoGenerateRectFill;
        }
        let url = this.stringToURL(this.#_autoGenerateRectFill);
        if (url === this.#_autoGenerateRectFill) { // not a URL and identical return - stringToURL failed 
            console.warn(`WARNING: could not parse augoGenRectFill ${this.#_autoGenerateRectFill} to URL, or otherwise determine auto rect fill getter, getter returning null`, this);
            return null;
        }
        return url;
    }

    /** 
     * The fill value used if a rect is autogenerated 
     * for this mask, via {@linkcode autoGenerateRect}.
     * 
     * It can be a color (`"#ff0000"`), {@linkcode svgGradient}, 
     * string URL referencing a gradient (see {@linkcode isURL}), 
     * string color array to generate a new gradient, or `null`. 
     * If `null`, generates a new gradient using the 
     * gradient template {@linkcode svgGradient.templates.bw}
     * @returns {svgGradient|string|string[]|null} 
     */
    get autoGenerateRectFill() { return this.#_autoGenerateRectFill; }
    /**
     * @param {svgGradient|string[]|string|null} v 
     * Value to set the fill to. It can be a color (`"#ff0000"`), 
     * {@linkcode svgGradient}, string URL referencing a gradient 
     * (see {@linkcode isURL}), string color array to generate a new 
     * gradient, or `null`. If `null`, generates a new gradient using 
     * the gradient template {@linkcode svgGradient.templates.bw} 
     */
    set autoGenerateRectFill(v) {
        let prev = this.#_autoGenerateRectFill; this.#_autoGenerateRectFill = v; this.changed('autoGenerateRectFill', v, prev);
    }
    /** @type {svgGradient|string|string[]|null} */
    #_autoGenerateRectFill = null;

    /** 
     * Convenience. Passed an {@linkcode svgGradient} value into
     * {@linkcode autoGenerateRectFill}. Has no counterpart getter
     * as the returned value may not be an `svgGradient`.
     * - **Note:** The {@linkcode onChange} callback type for this
     * will still be `"autoGenerateRectFill"`. 
     * @param {svgGradient} v */
    set gradient(v) { this.autoGenerateRectFill = v; }
    /** Convenience. Get/set {@linkcode autoGenerateRectFill} easily. @returns {svgGradient|string|string[]|null} */
    get fill() { return this.autoGenerateRectFill; }
    set fill(v) { this.autoGenerateRectFill = v; }

    /** 
     * Container for an {@linkcode svgDefinition} that's 
     * used as a `<mask>` element in HTML, generally used  
     * for alpha-masking an image (such as by using 
     * {@linkcode svgImageDefinition}) or another SVG. 
     * @param {string} [id] Unique identifier for this element (see {@linkcode svgElement.id}). If blank/omitted, sets to {@linkcode svgElement.uniqueID}. 
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/mask
     */
    constructor(id = undefined) {
        super(id, 'mask');
        this.includeXYWHInData = false;
        this.onChange = this._maskOnChange;
    }
    /**
     * Internal {@linkcode svg.onChange onChange} callback for this mask
     * @param {string} valueChanged Name of the value that was changed 
     * @param {any} newValue Newly assigned value 
     * @param {any} previousValue Previous value (for reference)
     * @param {svgElement} _changedElement Element that was changed (typically `this`)
     * @param  {...any} _extraParameters Any extra parameters provided 
     * @private @returns {void}
     */
    _maskOnChange(valueChanged, newValue, previousValue, _changedElement, ..._extraParameters) {
        if (isBlank(valueChanged)) { return; }
        console.log("value changed: " + valueChanged);
        let hashIndex = valueChanged.indexOf('#');
        let valueDetail;
        if (hashIndex >= 0) {
            valueDetail = valueChanged.substring(hashIndex + 1);
            valueChanged = valueChanged.substring(0, hashIndex);
        }
        switch (valueChanged) {
            case 'autoGenerateRectFill':
                // rect fill, check if value is inexplicably the same 
                if (newValue === previousValue) { return; }
                // if new value is an svgElement,
                // check if it has a different rootParent than this def (or if its null).
                // if so, ensure its onchange is passed along here 
                if (newValue instanceof svgElement) {
                    let listenForChange = newValue.parent == null || newValue.rootParent != this.rootParent;
                    if (listenForChange) {
                        newValue._prefixOnChange = 'autoGradient';
                        // newValue.parent = this;
                        newValue.onChange = this._maskOnChange;
                    }
                }
                break;
            case 'autoGradient':
                // TODO: need to retain "this" thru extra callback to bubble onChange up to svgHTMLAsset 
                // Issue URL: https://github.com/nickyonge/evto-web/issues/70
                console.log("Autogradient changed: " + valueDetail);
                console.log("Changed element: " + _changedElement.svgConstructor);
                console.log("this: " + this.svgConstructor);
                console.log("parent: " + this.parent);
                break;
        }
    }

    get html() {
        if (!this.autoGenerateRect) { return super.html; }

        // ensure we bypass external html generation
        let prevSubHandlesHTML = this.subclassHandlesHTML;
        this.subclassHandlesHTML = true;
        super.html; // for error checking 

        // get fill value (this also generates #_autoGradient)
        let fillURL = this.autoGenerateRectFillURL;

        // create 
        this.#_autoRect = new svgRect(this.x, this.y, this.width, this.height, fillURL);
        this.#_autoRect.skipNextOnChangeForID = true;
        this.#_autoRect.id = this.#_getAutoID(false);

        let gradientHTML = '';
        if (this.#_autoGradient != null) {
            gradientHTML = this.#_autoGradient.html;
        }
        let maskHTML = `<${this.defType}${this.data}>`;
        let rectHTML = `${svgConfig.HTML_INDENT ? '\t' : ''}${this.#_autoRect.html}`;
        maskHTML = [maskHTML, rectHTML, `</${this.defType}>`].join(`${svgConfig.HTML_NEWLINE ? '\n' : ''}`);
        let h = [gradientHTML, maskHTML].join(`${svgConfig.HTML_NEWLINE ? '\n' : ''}`);
        this.#_autoGradient = null;
        this.#_autoRect = null;
        this.subclassHandlesHTML = prevSubHandlesHTML;
        return h;
    }

    get data() {
        return [super.data, this.ParseData([
            ['mask-type', this.maskType],
            ['maskUnits', this.maskUnits],
            ['maskContentUnits', this.maskContentUnits],
        ])].join(' ');
    }

    /** @type {svgRect} */
    #_autoRect = null;
    /** @type {svgGradient} */
    #_autoGradient = null;

    /** get ID for an autogen element @param {boolean} forGradient for gradient (`t`) or rect (`f`)? @returns {string} */
    #_getAutoID(forGradient) {
        if (forGradient) {
            return `__AUTOGEN_ID_DEF${this.svgInstanceNumber}_GRD${this.#_autoGradient.svgInstanceNumber}`;
        }
        return `__AUTOGEN_ID_DEF${this.svgInstanceNumber}_RCT${this.#_autoRect.svgInstanceNumber}`;
    }

}

// #endregion Img/Mask 
