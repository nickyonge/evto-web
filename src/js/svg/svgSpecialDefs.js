import { svgDefinition, svgDefaults, svgElement, svgHTMLAsset, svgViewBox, svgRect, svgGradient } from "./index";
import { IsStringColor } from "../lilutils";

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
    #_matchViewboxXYWH = svgDefaults.XYWHDEFINITION_MATCH_VIEWBOX;

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
     * @param {string} [id] unique identifier for this element  
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

export class svgImageDefinition extends svgXYWHDefinition {

    /**
     * 
     * @param {string} id 
     */
    constructor(id = undefined) {
        super(id, 'image');
    }

}

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
     * @returns {boolean} */
    get autoGenerateRect() { return this.#_autoGenerateRect; }
    set autoGenerateRect(v) {
        let prev = this.#_autoGenerateRect; this.#_autoGenerateRect = v; this.changed('autoGenerateRect', v, prev);
    }
    /** @type {boolean} */
    #_autoGenerateRect = svgDefaults.MASK_AUTOGENERATERECT;


    /** 
     * The fill value to use if a rect is autogenerated for 
     * this mask, via {@linkcode autoGenerateRect}.
     * 
     * It can be a color (`"#ff0000"`), {@linkcode svgGradient}, 
     * string URL referencing a gradient (see {@linkcode isURL}), 
     * string color array to generate a new gradient, or `null`. 
     * If `null`, generates a new gradient using the 
     * gradient template {@linkcode svgGradient.templates.bw}
     * 
     * Will always return `string`
     * @returns {string} */
    get autoGenerateRectFill() {
        if (this.#_autoGenerateRectFill == null) {
            this.#_autoGradient = new svgGradient(svgGradient.templates.bw);
            this.#_autoGradient.__SKIP_ID_UPDATE = true;
            this.#_autoGradient.id = this.#_getAutoID(true);
            return this.#_autoGradient.idURL;
        }
        if (this.#_autoGenerateRectFill instanceof svgGradient) {
            if (this.#_autoGenerateRectFill.parent == null) {
                // if the autogenrectfill gradient doesn't have a parent, 
                // clone instance so it can be generated + deleted w/o messing with original 
                this.#_autoGradient = Object.assign({}, this.#_autoGenerateRectFill);
                this.#_autoGradient.__SKIP_ID_UPDATE = true;
                this.#_autoGradient.id = this.#_getAutoID(true);
            }
            return this.#_autoGenerateRectFill.idURL;
        }
        if (Array.isArray(this.#_autoGenerateRectFill)) {
            this.#_autoGradient = new svgGradient(this.#_autoGenerateRectFill);
            this.#_autoGradient.__SKIP_ID_UPDATE = true;
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
     * @param {svgGradient|string[]|string|null} v 
     * Value to set the fill to. It can be a color (`"#ff0000"`), 
     * {@linkcode svgGradient}, string URL referencing a gradient 
     * (see {@linkcode isURL}), string color array to generate a new 
     * gradient, or `null`. If `null`, generates a new gradient using 
     * the gradient template {@linkcode svgGradient.templates.bw} 
     * */
    set autoGenerateRectFill(v) {
        let prev = this.#_autoGenerateRectFill; this.#_autoGenerateRectFill = v; this.changed('autoGenerateRectFill', v, prev);
    }
    /** @type {svgGradient|string|string[]|null} */
    #_autoGenerateRectFill = null;

    /**
     * 
     * @param {string} id 
     */
    constructor(id = undefined) {
        super(id, 'mask');
    }

    get html() {
        if (!this.autoGenerateRect) { return super.html; }
        // create fill and gradient

        // TODO: svgMaskDef to handle its own html generation 
        // Issue URL: https://github.com/nickyonge/evto-web/issues/69
        // interrupt + manually do html generation, 
        // create <lineargradient> BESIDE <mask>
        // don't push them into subDefinitions (might mean u dont have to skip ID update)

        console.log(this.parent.svgConstructor);
        let fill = this.autoGenerateRectFill;
        this.#_autoRect = new svgRect(this.x, this.y, this.width, this.height, fill);
        this.#_autoRect.storeInDefsElement = false;
        this.#_autoRect.__SKIP_ID_UPDATE = true;
        this.#_autoRect.id = this.#_getAutoID(false);
        if (this.#_autoGradient != null) {
            this.subDefinitions.push(this.#_autoGradient);
        }
        this.subDefinitions.push(this.#_autoRect);
        let h = super.html;
        if (this.#_autoGradient != null) {
            this.subDefinitions.remove(this.#_autoGradient);
        }
        this.subDefinitions.remove(this.#_autoRect);
        this.#_autoGradient = null;
        this.#_autoRect = null;
        console.log(h);
        return h;
    }

    get data() {
        return [super.data, this.ParseData([
            ['mask-type', this.maskType],
            ['maskContentUnits', this.maskUnits],
            ['maskContentUnits', this.maskContentUnits],
        ])].join(' ');
    }

    /** @type {svgRect} */
    #_autoRect = null;
    /** @type {svgGradient} */
    #_autoGradient = null;

    /** get ID for an autogen element @param {boolean} forGradient for gradient (`t`) or rect (`f`)? @returns {string} */
    #_getAutoID(forGradient) {
        console.log("Getting auto ID, for gradent: " + forGradient);
        if (!forGradient) { console.log("istnace: " + `${typeof this.#_autoRect.svgInstanceNumber}`) }
        if (forGradient) {
            return `__AUTOGEN_ID_DEF${this.svgInstanceNumber}_GRD${this.#_autoGradient.svgInstanceNumber}`;
        }
        console.log("hmmm");
        return `__AUTOGEN_ID_DEF${this.svgInstanceNumber}_RCT${this.#_autoRect.svgInstanceNumber}`;
        // return `__AUTOGEN_ID_DEF${this.svgInstanceNumber}_${forGradient ? `GRD${this.#_autoGradient.svgInstanceNumber}` : `RCT${this.#_autoRect.svgInstanceNumber}`}`;
    }

}

// #endregion Img/Mask 
