import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

import demoImageSrc from '../../assets/png/demo-paintings/demopainting1.png';
import { svgGradient } from "../svg/svgGradient";
import * as svg from '../svg/index';
import { EnsureToNumber, isBlank, isStringAndBlank, isStringNotBlank } from "../lilutils";

export class ImageField extends TitledComponent {

    /** @type {ImageContainer[]} */
    #addedImgs = [];
    /** @type {[svg.htmlAsset,HTMLElement][]} */
    #addedSVGs = [];

    /** @returns {(ImageContainer|[svg.htmlAsset,HTMLElement])[]} */
    get #addedAssets() {
        if (this.#addedImgs == null) { this.#addedImgs = []; }
        if (this.#addedSVGs == null) { this.#addedSVGs = []; }
        return [...this.#addedImgs, ...this.#addedSVGs];
    }

    /** @type {ImageContainer} */
    #_demoImage;
    /** @type {svg.htmlAsset} */
    #_demoSvgRect;

    /** Are duplicicate images allowed? Default `true` @returns {boolean} */
    get allowDuplicateImages() { return this.#_allowDuplicateImages; }
    set allowDuplicateImages(v) { this.#_allowDuplicateImages = v; }
    /** @type {boolean} */
    #_allowDuplicateImages = true;

    /**
     * 
     * @param {string|ImageContainer|svg.htmlAsset|HTMLElement|pathNode|[string,string?]|[pathNode,string?]} [src]
     * @param {string} [componentTitle] Optional title to add to this component 
     */
    constructor(src, componentTitle) {
        super(componentTitle);
        ui.AddClassesToDOM(this.div, 'imageField', 'container');
        if (src == null) { return; }
        if (src instanceof svg.htmlAsset) {
            // svgHTMLAsset
            this.addSVG(src);
            return;
        } else if (Array.isArray(src)) {
            // [string,string?] or [pathNode,string?]
            switch (src.length) {
                case 1:
                    this.addImage(src[0]);
                    break;
                case 2:
                    this.addImage(src[0], src[1]);
                    break;
            }
            return;
        }
        // string, ImageContainier, HTMLElement, or pathNode
        this.addImage(src);
    }

    /**
     * Adds an image div to this image container. 
     * Returns the newly-created `HTMLElement` div for the image.
     * Will return `null` if imgSrc is null/whitespace.
     * 
     * `imgSrc` can be the following types:
     * - `string`, used directly as the value for `src` attribute
     * - `pathNode`, retrieves the `URL` element from the `pathNode`
     * - `HTMLElement`, uses this element instead of creating a new one 
     * @param {string | pathNode | HTMLElement | ImageContainer} imgSrc Value to add to the "src" attribute to the new img 
     * @param {string} [alt=null] Alt text to provide to the new img (optional) 
     * @param {boolean} [canvasSized=true] Assign the `canvasSizedImg` CSS class, forcing 2:1 aspect ratio? Default `true` 
     * @param {number} [zSort=0] Assignment for z-index CSS class. 0: leave default, >=1: assign class `onTop`, <=0: assign class `onBottom`. Default 0
     * @param {...string} extraClasses Optional extra classes to add to image  
     * @returns {ImageContainer|null}
     * @see {@link ui.CreateImage}
     */
    addImage(imgSrc, alt = null, canvasSized = true, zSort = 0, ...extraClasses) {
        if (imgSrc == null) { return null; }
        /** @type {ImageContainer} */ let img;
        img = this.getImage(imgSrc);
        if (img == null) {
            // new image, carry on 
        } else {
            // existing image, check if duplicate images are allowed 
            if (!this.allowDuplicateImages) { return; }
        }
        // prepare image type 
        if (imgSrc instanceof HTMLElement) {
            // pre-existing element 
            img = new ImageContainer(this, imgSrc, alt);
        } else if (imgSrc instanceof ImageContainer) {
            // pre-existing ImageContainer 
            img = new ImageContainer(this, imgSrc, alt);
        } else {
            // string or pathNode 
            let src = typeof imgSrc === 'string' ? imgSrc : imgSrc.URL;
            if (src == null) { return null; }
            src = src.trim();
            if (isBlank(src)) { return null; }
            img = new ImageContainer(this, src, alt);
        }
        this.#prepareHTMLElementImage(img, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(img.element);
        this.#addedImgs.push(img);
        return img;
    }

    /**
     * Gets the given image element, identified by source URL/pathNode/element, 
     * if it's found in this ImageField?
     * @param {string | pathNode | HTMLElement | ImageContainer | number} imgSrc `src` value for the image (or index of the image)
     * @returns {ImageContainer | null}
     */
    getImage(imgSrc) {
        let i = typeof imgSrc === 'number' ? imgSrc : this.#getImageIndex(imgSrc);
        if (i == -1) { return null; }
        return i > -1 ? this.#addedImgs[i] : null;
    }

    /**
     * is the given image, identified by source URL/pathNode/element, in this ImageField?
     * @param {string | pathNode | ImageContainer | HTMLElement} imgSrc `src` value for the image
     * @returns {boolean}
     */
    hasImage(imgSrc) {
        return this.#getImageIndex(imgSrc) > -1;
    }

    /**
     * Extract the source from a given imgSrc, either `string`, `ImageContainer`, `pathNode`, or `HTMLElement`. Returns `null` if src can't be found
     * @param {string | pathNode | ImageContainer | HTMLElement} imgSrc `src` value input. If just a string, returns itself - otherwise, extracts the `src` value as needed 
     * @returns {string | null}
     */
    getImgSrc(imgSrc) {
        return ImageField.GetImageSource(imgSrc);
    }

    /**
     * Extract the source from a given imgSrc, either `string`, `ImageContainer`, `pathNode`, or `HTMLElement`. Returns `null` if src can't be found
     * @param {string | pathNode | ImageContainer | HTMLElement} imgSrc `src` value input. If just a string, returns itself - otherwise, extracts the `src` value as needed 
     * @returns {string | null}
     */
    static GetImageSource(imgSrc) {
        if (imgSrc == null) { return null; }
        if (typeof imgSrc === 'string') { return imgSrc; }
        if (imgSrc instanceof ImageContainer) {
            return imgSrc.url;
        } else if (imgSrc instanceof HTMLElement) {
            // HTMLElement, get src attribute 
            return ui.GetAttribute(imgSrc, 'src');
        }
        // process of elimination, pathNode
        return imgSrc['URL'] ? imgSrc.URL : null;
    }

    /**
     * Extract the source from a given imgSrc, either `string`, `ImageContainer`, `pathNode`, or `HTMLElement`. Returns `null` if src can't be found
     * @param {string | pathNode | ImageContainer | HTMLElement} imgSrc `src` value input. If just a string, returns itself - otherwise, extracts the `src` value as needed 
     * @returns {string | null}
     */
    GetImageAltFromSrc(imgSrc) {
        if (imgSrc == null) { return null; }
        let img = this.getImage(imgSrc);
        if (imgSrc != null) {
            return img.alt;
        }
        // not already added, check child types for embedded alt 
        if (imgSrc instanceof ImageContainer) {
            // ImageContainer should have its own alt 
            return imgSrc.alt;
        } else if (imgSrc instanceof HTMLElement) {
            // HTMLElement, get alt attribute 
            return ui.GetAttribute(imgSrc, 'alt');
        }
        // nothing found 
        return null;
    }

    /**
     * 
     * @param {string | pathNode | HTMLElement | ImageContainer} imgSrc `src` value for the image
     * @returns {number}
     */
    #getImageIndex(imgSrc) {
        let src = this.getImgSrc(imgSrc);
        if (src == null) { return -1; }
        for (let i = 0; i < this.#addedImgs.length; i++) {
            let addedSrc = this.getImgSrc(this.#addedImgs[i]);
            if (addedSrc == src) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Remove the given image by source URL/pathNode/HTMLElement. 
     * Returns `true` if image was successfully found and removed.
     * @param {string | pathNode | HTMLElement | ImageContainer} imgSrc `src` value for the image
     * @returns {boolean} `true` if the image was removed, `false` if not (either because it couldn't be removed or it wasn't found)
     */
    removeImage(imgSrc) {
        if (imgSrc == null) { return false; }
        let index = this.#getImageIndex(imgSrc);
        if (index == -1) { return false; }
        let img = this.getImage(index);
        if (img == null) { return false; }
        // found index and image, remove from array, delete image 
        let removed = this.#addedImgs.remove(img) != null;
        img.remove();
        return removed;
    }

    /**
     * Adds an {@link svgHTMLAsset} to this image container. 
     * Returns whether or not the SVG was successfully added.
     * Will return `false` if svgAsset is null, or if it's already added (and `allowDuplicates` if `false`).
     * @param {svg.htmlAsset} svgAsset SVG asset to add
     * @param {svg.onChange} [onChangeCallback=null] Additional custom callback for when this SVG is modified (if not already assigned) 
     * @param {boolean} [canvasSized=true] Assign the `canvasSizedImg` CSS class, forcing 2:1 aspect ratio? Default `true` 
     * @param {number} [zSort=0] Assignment for z-index CSS class. 0: leave default, >=1: assign class `onTop`, <=0: assign class `onBottom`. Default 0
     * @param {boolean} [allowDuplicates=false] Allow duplicates, if already added? Default `false`
     * @param {...string} extraClasses Optional extra classes to add to SVG 
     * @returns {boolean}
     */
    addSVG(svgAsset, onChangeCallback = null, canvasSized = true, zSort = 0, allowDuplicates = false, ...extraClasses) {
        if (svgAsset == null) { return false; }
        if (!allowDuplicates && this.hasSVG(svgAsset)) { return false; }
        let newSVGDiv = ui.CreateDiv();
        this.#prepareHTMLElementImage(newSVGDiv, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newSVGDiv);
        svgAsset.onChange = function () { newSVGDiv.innerHTML = svgAsset.html; };
        if (onChangeCallback != null && typeof onChangeCallback === 'function') {
            svgAsset.onChange = onChangeCallback;
        }
        newSVGDiv.innerHTML = svgAsset.html;
        this.#addedSVGs.push([svgAsset, newSVGDiv]);
        return true;
    }

    /**
     * 
     * @param {svg.htmlAsset|HTMLElement} asset Either an `svgHTMLAsset` or its associated div. 
     * @returns {boolean}
     */
    removeSVG(asset) {
        if (asset == null) { return false; }
        let index = this.#getSVGIndex(asset);
        if (index == -1) { return false; }
        /** @type {[svg.htmlAsset,HTMLElement]} */
        let removedArray = this.#addedSVGs.removeAt(index);
        if (removedArray == null) { return false; }
        removedArray[0] = null; // gosh I hate "just set it to null" as the deletion method 
        removedArray[1].remove();
        return true;
    }

    /**
     * Removes the current asset div, assuming it's either an image childed to this ImageField,
     * or the associated div of an SVG related to this ImageField.
     * @param {HTMLElement} div 
     * @returns {boolean}
     */
    removeAsset(div) {
        if (div == null) { return false; }
        let assets = this.#addedAssets;
        for (let i = 0; i < assets.length; i++) {
            let a = assets[i];
            if (Array.isArray(a)) {
                if (a[1] === div) {
                    return this.removeSVG(div);
                }
            } else if (a instanceof ImageContainer) {
                if (a.element === div) {
                    let removed = this.removeImage(a);
                    a = null;
                    return removed;
                }
            }
        }
        return false;
    }

    /** Prep an HTMLElement to be added 
     * @param {HTMLElement|ImageContainer} element HTMLElement to prepare 
     * @param {boolean} [canvasSized=true] is this element canvas-sized (2:1)? Default `true` 
     * @param {number} zSort Z-sorting? 0/null/default=none, -1/<0=onBottom, 1/>0=onTop
     * @param  {...string} extraClasses Any additional CSS classes to add 
     * @returns {void}
     */
    #prepareHTMLElementImage(element, canvasSized = true, zSort = 0, ...extraClasses) {
        if (element == null) { return; }
        if (element instanceof ImageContainer) {
            element = element.element;
        }
        ui.AddClassesToDOM(element, 'image');
        if (canvasSized) { ui.AddClassesToDOM(element, 'canvasSizedImg'); }
        zSort = EnsureToNumber(zSort, false); // z-index sorting 
        ui.RemoveClassesFromDOM(element, 'onTop', 'onBottom'); // just in case it's a pre-existing element 
        if (zSort == 0 || Number.isNaN(zSort) || zSort == null) { } // default z-index, do nothing 
        else if (zSort > 0) { ui.AddClassesToDOM(element, 'onTop'); } // always on top 
        else if (zSort < 0) { ui.AddClassesToDOM(element, 'onBottom'); } // always on bottom 
        if (extraClasses != null) { ui.AddClassesToDOM(element, ...extraClasses); } // extra classes 
    }

    CreateDemoImageAndSVG() {
        this.CreateDemoImage();
        let svg = this.CreateDemoSVG(svgGradient.templates.trans);
        svg.gradient.opacity = 0.69;
        svg.gradient.sharpness = 0.69;
    }

    CreateDemoImage() {
        if (this.#_demoImage == null) {
            this.#_demoImage = this.addImage(demoImageSrc, 'Demo Image');
        }
        return this.#_demoImage;
    }
    /**
     * Creates a demo SVG, with an optional array of colors for a gradient 
     * @param  {spreadString} [colors] 
     * @returns {svg.htmlAsset}
     */
    CreateDemoSVG(...colors) {
        if (this.#_demoSvgRect == null) {
            this.#_demoSvgRect = BasicGradientRect(...colors);
            this.addSVG(this.#_demoSvgRect);
        }
        return this.#_demoSvgRect;
    }

    /**
     * Returns the index of the given `svgHTMLAsset` or its associated element.
     * If not found, returns `-1`
     * @param {svg.htmlAsset|HTMLElement} asset 
     * @returns {number}
     */
    #getSVGIndex(asset) {
        if (asset == null) { return -1; }
        let isElement = asset instanceof HTMLElement;
        for (let i = 0; i < this.#addedSVGs.length; i++) {
            if (this.#addedAssets[i][isElement ? 1 : 0] === asset) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Has the given {@link svg.htmlAsset svgHTMLAsset} already been added? 
     * @param {svg.htmlAsset} svgAsset 
     * @returns {boolean}
     */
    hasSVG(svgAsset) {
        return this.#getSVGIndex(svgAsset) > -1;
    }

    get demoImage() { return this.CreateDemoImage(); }
    get demoSVG() { return this.CreateDemoSVG(); }
}

/**
 * How should the `element` property in an ImageContainer be assigned, 
 * when it's passed another ImageContainer in its constructor? 
 * @type {'new'|'same'|'clone'} */
const IMGCONT_FROM_IMGCONT_ELEMENT = 'new';

/** What method should be used to apply opacity to an image? @type {'opacity'|'filter'} */
const IMGCONT_OPACITY_METHOD = 'opacity';

export class ImageContainer {

    /** URL value for the image @returns {string} */
    get url() { return this.#_url; }
    /** @param {string} url  */
    set url(url) { this.#_url = url; this.UpdateAttributes(); }
    /** URL value for the image @type {string} */
    #_url;
    /** Image opacity, from `0.0` to `1.0` @returns {number} */
    get opacity() { return this.#_opacity; }
    /** @param {number} opacity  */
    set opacity(opacity) { this.#_opacity = opacity; this.UpdateAttributes(); }
    /** Image opacity @type {number} */
    #_opacity = 1;
    /** HTMLElement this image is added to @returns {HTMLElement} */
    get element() { return this.#_element; }
    /** @param {HTMLElement} element  */
    set element(element) { this.#_element = element; this.UpdateAttributes(); }
    /** HTMLElement this image is added to @type {HTMLElement} */
    #_element;

    /** 
     * Parent {@linkcode ImageField} of this container. Does not 
     * need to be assigned immediately, but must be assigned before 
     * it can be used in the document. @returns {ImageField}
    */
    get parent() { return this.#_parent; }
    /** @param {ImageField} parent  */
    set parent(parent) { this.#_parent = parent; }
    /** @type {ImageField} */
    #_parent;

    /** Flag for initialization, to prevent pre-init updates */
    #_initialized = false;

    /**
     * 
     * @param {ImageField|ImageContainer} parent 
     * @param {string|HTMLElement|pathNode|ImageContainer} imgSrc 
     * @param {string} [alt=undefined] Alt text for image (optional) 
     */
    constructor(parent, imgSrc, alt = undefined) {
        // determine parent 
        if (parent == null) {
            // parent will need to be assigned later  
        } else if (parent instanceof ImageContainer) {
            this.parent = parent.parent;
        } else {
            this.parent = parent;
        }
        // get URL 
        this.url = ImageField.GetImageSource(imgSrc);
        // determine source type for element 
        if (typeof imgSrc === 'string') {
            // url 
            this.element = ui.CreateImage(imgSrc, alt);
        } else if (imgSrc instanceof ImageContainer) {
            // ImageContainer copy (create new)
            switch (IMGCONT_FROM_IMGCONT_ELEMENT) {
                default:
                    console.warn(`WARNING: invalid value for IMGCONT_FROM_IMGCONT_ELEMENT: ${IMGCONT_FROM_IMGCONT_ELEMENT}, defaulting to 'new', investigate`, this);
                case 'new':
                    if (alt == null) { alt = imgSrc.alt; }
                    this.element = ui.CreateImage(this.url, alt);
                    break;
                case 'same':
                    this.element = imgSrc.element;
                    if (alt != null) { this.element.setAttribute('alt', alt); }
                    break;
                case 'clone':
                    this.element = /** @type {HTMLElement} */ (imgSrc.element.cloneNode(false));
                    if (alt != null) { this.element.setAttribute('alt', alt); }
                    break;
            }
        } else if (imgSrc instanceof HTMLElement) {
            // element 
            this.element = imgSrc;
            if (alt != null) { this.element.setAttribute('alt', alt); }
        } else {
            // pathNode 
            this.element = ui.CreateImage(imgSrc.URL, alt);
        }
        // confirm init, ensure attributes are correct 
        this.#_initialized = true;
        this.UpdateAttributes();
    }

    /** Update `src` and `style.opacity` attributes */
    UpdateAttributes() {
        if (!this.#_initialized) { return; }
        // set URL 
        this.element.setAttribute('src', this.url);

        // set opacity 
        switch (IMGCONT_OPACITY_METHOD) {
            default:
                console.warn(`WARNING: invalid value for IMGCONT_OPACITY_METHOD: ${IMGCONT_OPACITY_METHOD}, defaulting to 'opacity', investigate`, this);
            case 'opacity':
                this.element.style.opacity = this.opacity;
                break;
            case 'filter':
                this.element.style.filter = `alpha(opacity=${this.opacity * 100})`;
                break;
        }
    }

    /** Get/set the alt value of this ImageContainer's element @returns {string} */
    get alt() { return this.element.getAttribute('alt'); }
    /** @param {string} alt New alt value to set */
    set alt(alt) { this.element.setAttribute('alt', alt); }

    /** Remove and delete this ImageContainer's {@linkcode element}, and set {@linkcode parent} to `null` */
    remove() {
        if (this.element != null) {
            this.element.remove();
            this.element = null;
        }
        this.url = null;
        this.parent = null;
    }
}
