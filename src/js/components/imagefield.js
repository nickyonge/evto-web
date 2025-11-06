import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

import demoImageSrc from '../../assets/png/demo-paintings/demopainting1.png';
import { svgGradient } from "../svg/svgGradient";
import * as svg from '../svg/index';
import { EnsureToNumber, isBlank, isStringAndBlank, isStringNotBlank } from "../lilutils";

export class ImageField extends TitledComponent {

    /** @type {HTMLElement[]} */
    #addedImgs = [];
    /** @type {[svg.asset,HTMLElement][]} */
    #addedSVGs = [];

    /** @returns {(HTMLElement|[svg.asset,HTMLElement])[]} */
    get #addedAssets() {
        if (this.#addedImgs == null) { this.#addedImgs = []; }
        if (this.#addedSVGs == null) { this.#addedSVGs = []; }
        return [...this.#addedImgs, ...this.#addedSVGs];
    }

    /** @type {HTMLElement} */
    #_demoImage;
    /** @type {svg.asset} */
    #_demoSvgRect;

    /**
     * 
     * @param {string|svg.asset|HTMLElement|pathNode|[string,string]|[pathNode,string]} [src]
     * @param {string} [componentTitle] Optional title to add to this component 
     */
    constructor(src, componentTitle) {
        super(componentTitle);
        ui.AddClassesToDOM(this.div, 'imageField', 'container');
        if (src == null) { return; }
        if (src instanceof svg.asset) {
            // svgHTMLAsset
            this.addSVG(src);
            return;
        }
        if (Array.isArray(src)) {
            // [string,string] or [pathNode,string]
            this.addImage(src[0], src[1]);
            return;
        }
        // string, HTMLElement, or pathNode
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
     * @param {string | pathNode | HTMLElement} imgSrc Value to add to the "src" attribute to the new img 
     * @param {string} [alt=null] Alt text to provide to the new img (optional) 
     * @param {boolean} [canvasSized=true] Assign the `canvasSizedImg` CSS class, forcing 2:1 aspect ratio? Default `true` 
     * @param {number} [zSort=0] Assignment for z-index CSS class. 0: leave default, >=1: assign class `onTop`, <=0: assign class `onBottom`. Default 0
     * @param {...string} extraClasses Optional extra classes to add to image  
     * @returns {HTMLElement|null}
     * @see {@link ui.CreateImage}
     */
    addImage(imgSrc, alt = null, canvasSized = true, zSort = 0, ...extraClasses) {
        if (imgSrc == null) { return null; }
        /** @type {HTMLElement} */ let img;
        if (imgSrc instanceof HTMLElement) {
            // pre-existing 
            img = imgSrc;
        } else {
            let src = typeof imgSrc === 'string' ? imgSrc : imgSrc.URL;
            if (src == null) { return null; }
            src = src.trim();
            if (isBlank(src)) { return null; }
            img = ui.CreateImage(src, alt);
        }
        this.#prepareHTMLElementImage(img, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(img);
        this.#addedImgs.push(img);
        return img;
    }

    /**
     * Gets the given image element, identified by source URL/pathNode/element, 
     * if it's found in this ImageField?
     * @param {string | pathNode | HTMLElement | number} imgSrc `src` value for the image (or index of the image)
     * @returns {HTMLElement | null}
     */
    getImage(imgSrc) {
        let i = typeof imgSrc === 'number' ? imgSrc : this.#getImageIndex(imgSrc);
        if (i == -1) { return null; }
        return i > -1 ? this.#addedImgs[i] : null;
    }

    /**
     * is the given image, identified by source URL/pathNode/element, in this ImageField?
     * @param {string | pathNode | HTMLElement} imgSrc `src` value for the image
     * @returns {boolean}
     */
    hasImage(imgSrc) {
        return this.#getImageIndex(imgSrc) > -1;
    }

    /**
     * Extract the source from a given imgSrc, either `string`, `pathNode`, or `HTMLElement`. Returns `null` if src can't be found
     * @param {string | pathNode | HTMLElement} imgSrc `src` value input. If just a string, returns itself - otherwise, extracts the `src` value as needed 
     * @returns {string | null}
     */
    getImgSrc(imgSrc) {
        if (imgSrc == null) { return null; }
        if (typeof imgSrc === 'string') { return imgSrc; }
        if (imgSrc instanceof HTMLElement) {
            // HTMLElement, get src attribute 
            return ui.GetAttribute(imgSrc, 'src');
        }
        // process of elimination, pathNode
        return imgSrc['URL'] ? imgSrc.URL : null;
    }

    /**
     * 
     * @param {string | pathNode | HTMLElement} imgSrc `src` value for the image
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
     * @param {string | pathNode | HTMLElement} imgSrc `src` value for the image
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
     * @param {svg.asset} svgAsset SVG asset to add
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
     * @param {svg.asset|HTMLElement} asset Either an `svgHTMLAsset` or its associated div. 
     * @returns {boolean}
     */
    removeSVG(asset) {
        if (asset == null) { return false; }
        let index = this.#getSVGIndex(asset);
        if (index == -1) { return false; }
        /** @type {[svg.asset,HTMLElement]} */
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
            if (Array.isArray(assets[i])) {
                if (assets[i][1] === div) {
                    return this.removeSVG(div);
                }
            } else {
                if (assets[i] === div) {
                    return this.removeImage(div);
                }
            }
        }
        return false;
    }

    /** Prep an HTMLElement to be added 
     * @param {HTMLElement} element HTMLElement to prepare 
     * @param {boolean} [canvasSized=true] is this element canvas-sized (2:1)? Default `true` 
     * @param {number} zSort Z-sorting? 0/null/default=none, -1/<0=onBottom, 1/>0=onTop
     * @param  {...string} extraClasses Any additional CSS classes to add 
     */
    #prepareHTMLElementImage(element, canvasSized = true, zSort = 0, ...extraClasses) {
        if (element == null) { return; }
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
     * @returns {svg.asset}
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
     * @param {svg.asset|HTMLElement} asset 
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
     * Has the given {@link svg.asset svgHTMLAsset} already been added? 
     * @param {svg.asset} svgAsset 
     * @returns {boolean}
     */
    hasSVG(svgAsset) {
        return this.#getSVGIndex(svgAsset) > -1;
    }

    get demoImage() { return this.CreateDemoImage(); }
    get demoSVG() { return this.CreateDemoSVG(); }
}
