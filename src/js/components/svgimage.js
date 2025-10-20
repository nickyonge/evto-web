import { BasicGradientRect } from "../svg/svgGenerator";
import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

import demoImage from '../../assets/png/demo-paintings/demopainting1.png';
import { svgGradient } from "../svg/svgGradient";
import { svgHTMLAsset } from "../svg/svgElement";
import { EnsureToNumber } from "../lilutils";

// export class SVGImage extends BasicComponent {
export class SVGImage extends TitledComponent {


    #image;
    #addedImgs = [];
    #addedSVGs = [];
    get #addedAssets() {
        if (this.#addedImgs == null) { this.#addedImgs = []; }
        if (this.#addedSVGs == null) { this.#addedSVGs = []; }
        return this.#addedImgs.concat(this.#addedSVGs);
    }

    #_demoRect;
    #_demoImg;

    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'svgImage', 'container');

        // this.#image = ui.CreateDivWithClass('image', 'canvasSizedImg');
        this.#image = ui.CreateImageWithClasses(demoImage, 'Demo image', 'image', 'canvasSizedImg', 'onTop');
        // this.div.appendChild(this.#image);

        let gradientRect = BasicGradientRect(svgGradient.templates.bw);
        this.addSVG(gradientRect);
        gradientRect.gradient = svgGradient.templates.softrainbow;


        // let rainbow = BasicGradientRect(svgGradient.templates.softrainbow);
        // this.#image.innerHTML = rainbow.html;
    }

    addImage(imgSrc, alt = null, canvasSized = true, zSort = 0, ...extraClasses) {
        let newImg = ui.CreateImage(imgSrc, alt);
        this.#prepareHTMLElementImage(newImg, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newImg);
        this.#addedImgs.push(newImg);
    }
    /**
     * Adds an {@link svgHTMLAsset} to this image container
     * @param {svgHTMLAsset} svgAsset SVG asset to add
     */
    addSVG(svgAsset, canvasSized = true, zSort = 0, ...extraClasses) {
        if (svgAsset == null) { return; }
        let newSVG = ui.CreateDiv();
        this.#prepareHTMLElementImage(newSVG, canvasSized, zSort, ...extraClasses);
        this.div.appendChild(newSVG);
        svgAsset.onChange = function () { newSVG.innerHTML = svgAsset.html; }
        newSVG.innerHTML = svgAsset.html;
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

    get demoRect() {
        if (this.#_demoRect == null) {
            this.#_demoRect = BasicGradientRect('skyblue', 'white', 'pink');
            this.#_demoRect.onChange = function (valueChanged, newValue, previousValue, changedElement) {
                // console.log(`SVGAsset value ${valueChanged} changed to ${newValue} from ${previousValue} on ${changedElement.constructor.name}`);
            }
            this.#_demoRect.GetShape().fillGradient = this.#_demoRect.gradient;
            this.updateDemoRect();
        }
        return this.#_demoRect;
    }
    updateDemoRect() {
        if (this.#_demoImg == null) {
            this.#_demoImg = ui.CreateDivWithClass('image', 'canvasSizedImg');
            this.div.appendChild(this.#_demoImg);
        }
        this.#_demoImg.innerHTML = this.demoRect.html;
    }
}