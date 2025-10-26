import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

import demoImageSrc from '../../assets/png/demo-paintings/demopainting1.png';
import { svgGradient } from "../svg/svgGradient";
import { svgElement, svgHTMLAsset } from "../svg/svgElement";
import { EnsureToNumber, isBlank, isStringAndBlank } from "../lilutils";

export class ImageField extends TitledComponent {

    #addedImgs = [];
    #addedSVGs = [];
    get #addedAssets() {
        if (this.#addedImgs == null) { this.#addedImgs = []; }
        if (this.#addedSVGs == null) { this.#addedSVGs = []; }
        return this.#addedImgs.concat(this.#addedSVGs);
    }

    #_demoImage;
    #_demoSvgRect;

    IsSVGAdded(svgAsset) {
        return this.#addedSVGs.includes(svgAsset);
    }

    constructor(componentTitle) {
        super(componentTitle);
        ui.AddClassesToDOM(this.div, 'imageField', 'container');
    }

    /**
     * Adds an image div to this image container. 
     * Returns whether or not the image was successfully added.
     * Will return `false` if imgSrc is null/whitespace
     * @param {svgHTMLAsset} svgAsset SVG asset to add
     * @returns {boolean}
     * @see {@link ui.CreateImage}
     */
    addImage(imgSrc, alt = null, canvasSized = true, zSort = 0, ...extraClasses) {
        if (!isStringAndBlank(imgSrc)) { return false; }
        let newImg = ui.CreateImage(imgSrc, alt);
        this.#prepareHTMLElementImage(newImg, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newImg);
        this.#addedImgs.push(newImg);
        return true;
    }
    /**
     * Adds an {@link svgHTMLAsset} to this image container. 
     * Returns whether or not the SVG was successfully added.
     * Will return `false` if svgAsset is null, or if it's already added (and `allowDuplicates` if `false`).
     * @param {svgHTMLAsset} svgAsset SVG asset to add
     * @param {svgElement.onChangeCallback} [onChangeCallback=null] Additional custom callback for when this SVG is modified (if not already assigned) 
     * @param {boolean} [canvasSized=true] Assign the `canvasSizedImg` CSS class, forcing 2:1 aspect ratio? Default `true` 
     * @param {number} [zSort=0] Assignment for z-index CSS class. 0: leave default, >=1: assign class `onTop`, <=0: assign class `onBottom`. Default 0
     * @param {boolean} [allowDuplicates=false] Allow duplicates, if already added? Default `false`
     * @param {...string} extraClasses Optional extra classes to add to string 
     * @returns {boolean}
     */
    addSVG(svgAsset, onChangeCallback = null, canvasSized = true, zSort = 0, allowDuplicates = false, ...extraClasses) {
        if (svgAsset == null) { return false; }
        if (!allowDuplicates && this.IsSVGAdded(svgAsset)) { return false; }
        let newSVG = ui.CreateDiv();
        this.#prepareHTMLElementImage(newSVG, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newSVG);
        svgAsset.onChange = function () { newSVG.innerHTML = svgAsset.html; };
        newSVG.innerHTML = svgAsset.html;
        return true;
    }
    /** Prep an HTMLElement to be added 
     * @param {HTMLElement} e HTMLElement to prepare 
     * @param {boolean} [canvasSized=true] is this element canvas-sized (2:1)? Default `true` 
     * @param {number} zSort Z-sorting? 0/null/default=none, -1/<0=onBottom, 1/>0=onTop
     * @param  {...string} extraClasses Any additional CSS classes to add 
     */
    #prepareHTMLElementImage(e, canvasSized = true, zSort = 0, ...extraClasses) {
        if (e == null) { return; }
        ui.AddClassesToDOM(e, 'image');
        if (canvasSized) { ui.AddClassesToDOM(e, 'canvasSizedImg'); }
        zSort = EnsureToNumber(zSort, false); // z-index sorting 
        if (zSort == 0 || zSort == NaN || zSort == null) { } // default z-index, do nothing 
        else if (zSort > 0) { ui.AddClassesToDOM(e, 'onTop'); } // always on top 
        else if (zSort < 0) { ui.AddClassesToDOM(e, 'onBottom'); } // always on bottom 
        if (extraClasses != null) { ui.AddClassesToDOM(e, ...extraClasses); } // extra classes 
    }

    CreateDemoImage() {
        // TODO: finish create demo image / demo SVG in imageField 
        // Issue URL: https://github.com/nickyonge/evto-web/issues/59
        // this.#image = ui.CreateDivWithClass('image', 'canvasSizedImg');
        // this.#image = ui.CreateImageWithClasses(demoImage, 'Demo image', 'image', 'canvasSizedImg', 'onTop');
        // // this.div.appendChild(this.#image);

        // let gradientRect = BasicGradientRect(svgGradient.templates.bw);
        // this.addSVG(gradientRect);
        // gradientRect.gradient = svgGradient.templates.softrainbow;


        // let rainbow = BasicGradientRect(svgGradient.templates.softrainbow);
        // this.#image.innerHTML = rainbow.html;

    }
    CreateDemoSVG() {
        if (this.#_demoSvgRect == null) {
            this.#_demoSvgRect = BasicGradientRect('skyblue', 'white', 'pink');
            this.#_demoSvgRect.onChange = function () { console.log("CHANGED"); }
            this.addSVG(this.#_demoSvgRect);
        }
        return this.#_demoSvgRect;
    }

    get demoImage() {
        if (this.#_demoImage == null) {
            this.#_demoImage = ui.CreateImageWithClasses(this.demoImage, )
        }
        return this.#_demoImage;
    }

    get demoSVG() {
        return this.CreateDemoSVG();
    }
}