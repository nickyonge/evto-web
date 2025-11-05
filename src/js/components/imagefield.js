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
    /** @type {svg.asset[]} */
    #addedSVGs = [];

    /** @returns {(HTMLElement|svg.asset)[]} */
    get #addedAssets() {
        if (this.#addedImgs == null) { this.#addedImgs = []; }
        if (this.#addedSVGs == null) { this.#addedSVGs = []; }
        return [...this.#addedImgs, ...this.#addedSVGs];
    }

    /** @type {HTMLElement} */
    #_demoImage;
    /** @type {svg.asset} */
    #_demoSvgRect;

    // TODO ImageField, get/remove img/svg methods

    /**
     * 
     * @param {string|svg.asset|HTMLElement|pathNode|[string,string]|[pathNode,string]} [src]
     * @param {string} [componentTitle] 
     */
    constructor(src, componentTitle) {
        super(componentTitle);
        ui.AddClassesToDOM(this.div, 'imageField', 'container');
        if (src == null) { return; }
        if (typeof src === 'string') {
            // string, presumably img
            this.addImage(src);
            return;
        }
        if (src instanceof svg.asset) {
            // svgHTMLAsset
            this.addSVG(src);
            return;
        }
        if (src instanceof HTMLElement) {
            // HTMLElement, presumably img
            this.addImage(src);
            return;
        }
        if (Array.isArray(src)) {
            // [string,string] or [pathNode,string]
            this.addImage(src[0], src[1]);
            return;
        }
        // by process of elimination, pathNode
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
        if (!allowDuplicates && this.IsSVGAdded(svgAsset)) { return false; }
        let newSVG = ui.CreateDiv();
        this.#prepareHTMLElementImage(newSVG, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newSVG);
        svgAsset.onChange = function () { newSVG.innerHTML = svgAsset.html; };
        if (onChangeCallback != null && typeof onChangeCallback === 'function') {
            svgAsset.onChange = onChangeCallback;
        }
        newSVG.innerHTML = svgAsset.html;
        return true;
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
    CreateDemoSVG(...colors) {
        if (this.#_demoSvgRect == null) {
            this.#_demoSvgRect = BasicGradientRect(...colors);
            this.addSVG(this.#_demoSvgRect);
        }
        return this.#_demoSvgRect;
    }

    /**
     * Has the given {@link svg.asset svgHTMLAsset} already been added? 
     * @param {svg.asset} svgAsset 
     * @returns {boolean}
     */
    IsSVGAdded(svgAsset) {
        return this.#addedSVGs.includes(svgAsset);
    }

    get demoImage() { return this.CreateDemoImage(); }
    get demoSVG() { return this.CreateDemoSVG(); }
}
