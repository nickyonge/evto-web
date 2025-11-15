import * as cmp from "../components";
import * as ui from '../ui';
import * as txt from '../text';
import { svgHTMLAsset, svgShape, svgGradient, svgRect, svgDefinition, svgViewBox, svgMaskDefinition, svgImageDefinition, svgElement } from "../svg/index";
import { isBlank, SetElementEnabled } from "../lilutils";
import { DemoGradient } from "./uiDataPageBase";
import { mapImg } from "../assetExporter";

let currentSectionNum = 0;

let sectionContainer;
let sectionPattern;
let sectionColors;

/** Create the Pattern & Colours page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE -----
    // DemoPageContent(page);


    // create div selection bar
    let sectionSelection = new cmp.MutliOptionList('', SelectPatternPage, txt.PG_PATTERN_SECTIONS, null, null, currentSectionNum, true);

    // create page divs
    sectionContainer = ui.CreateDivWithClass('sectionContainer');
    sectionPattern = ui.CreateDivWithClass('section', 'pattern');
    sectionColors = ui.CreateDivWithClass('section', 'colors');

    // add elements to page 
    page.appendChild(sectionSelection);
    page.appendChild(sectionContainer);
    sectionContainer.appendChild(sectionPattern);
    sectionContainer.appendChild(sectionColors);

    // DemoGradient(sectionPattern);

    CreatePatternSection(sectionPattern);
    CreateColorsSection(sectionColors);

    /* REFERENCE PATTERNS 
    Square (empty canvas): https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z
    Horizontal Split: https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM0%2C5%20L20%2C5
    Vertical Split: https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM10%2C0%20L10%2C10
    Horizontal Wave (Line): https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM0%2C5%20C0%2C5%205%2C0%2010%2C5%20C10%2C5%2015%2C10%2020%2C5
    Vertical Wave (Line): https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM10%2C0%20C10%2C0%205%2C2.5%2010%2C5%20C10%2C5%2015%2C7.5%2010%2C10
    Horizontal Wave (Closed): https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM0%2C5%20C0%2C5%205%2C0%2010%2C5%20C10%2C5%2015%2C10%2020%2C5%20L20%2C10%20L0%2C10%20Z
    Vertical Wave (Closed): https://svg-path-visualizer.netlify.app/#M0%2C0%20L20%2C0%20L20%2C10%20L0%2C10%20Z%0AM10%2C0%20C10%2C0%205%2C2.5%2010%2C5%20C10%2C5%2015%2C7.5%2010%2C10%20L20%2C10%20L20%2C0%20Z
    */

    // initialize 
    SelectPatternPage(currentSectionNum);
}

const defaulSVGWidth = 1000;
const defaulSVGHeight = defaulSVGWidth * 0.5;

let patternAlphaSVG;
let patternAlphaGradient;
let patternMaskDefinition;
let patternImageDefinition;

const pMaskID = 'patternMask';
const pImageID = 'patternMaskedImage';
const imageURLLight = mapImg.full.monochrome.light.URL;
const imageURLDark = mapImg.full.monochrome.dark.URL;

class AlphaLayer {

    /** alpha layer's number (must be unique) @type {number} */
    number;

    /** URL referencing the image to display @type {string} */
    imageUrl;

    /** @type {svgHTMLAsset} */
    svg;
    /** @type {svgGradient} */
    gradient;
    /** @type {svgMaskDefinition} */
    maskDef;
    /** @type {svgImageDefinition} */
    imageDef;

    /** @type {cmp.ImageField} */
    imageFieldParent;

    /**
     * 
     * @param {number} number 
     * @param {string} imageURL 
     * @param {cmp.ImageField} [imageFieldParent] 
     * @returns 
     */
    constructor(number, imageURL, imageFieldParent) {
        if (number == null) { console.warn("WARNING: num can't be null when creating alphaLayer", this); return; }
        if (isBlank(imageURL)) { console.warn("WARNING: imageURL on alphaLayer can't be null/blank", this); return; }
        this.number = number;
        this.imageUrl = imageURL;
        this.#CreateSVG();
        if (imageFieldParent != null) {
            this.AddToImageField(imageFieldParent);
        }
    }

    #CreateSVG() {
        // html asset
        this.svg = new svgHTMLAsset(null, null, defaulSVGWidth, defaulSVGHeight);
        // svg gradient 
        this.gradient = new svgGradient(svgGradient.templates.bw);
        // mask definition 
        this.maskDef = new svgMaskDefinition();
        this.maskDef.id = this.#getIDMask;
        this.maskDef.gradient = this.gradient;
        // image definition 
        this.imageDef = new svgImageDefinition(this.imageUrl, this.#getIDImage);
        this.imageDef.mask = this.maskDef;
        // add mask and image to the SVG
        this.svg.definitions.push(this.maskDef, this.imageDef);
    }

    /**
     * Add this alphaLayer's {@linkcode svg} to a 
     * parent {@linkcode cmp.ImageField ImageField} 
     * @param {cmp.ImageField} imageField 
     */
    AddToImageField(imageField) {
        if (imageField == null) { console.warn("WARNING: can't add alphaLayer to null ImageField", this); return; }
        if (this.svg == null) { console.warn("WARNING: svg is null on alphaLayer, can't add to ImageField", this); return; }
        this.imageFieldParent = imageField;
        this.imageFieldParent.addSVG(this.svg);
    }

    get #getIDMask() { return `__UIDPAL${this.number}_SVG${this.svg.svgInstanceNumber}_MASK`; }
    get #getIDImage() { return `__UIDPAL${this.number}_SVG${this.svg.svgInstanceNumber}_IMAGE`; }

}

function CreatePatternSection(section) {
    let patternImage = new cmp.ImageField();
    section.appendChild(patternImage);

    patternImage.addImage(imageURLDark);
    let alphaLayer1 = new AlphaLayer(1, imageURLLight, patternImage);
    alphaLayer1.gradient.sharpness = 0.9;

    return;

    // basic param definitions 
    let width = 1000;
    let height = width / 2;

    // html asset
    patternAlphaSVG = new svgHTMLAsset(null, null, width, height);
    // svg gradient 
    patternAlphaGradient = new svgGradient(svgGradient.templates.bw);
    // mask definition 
    patternMaskDefinition = new svgMaskDefinition();
    patternMaskDefinition.id = pMaskID;
    patternMaskDefinition.gradient = patternAlphaGradient;
    // image definition 
    patternImageDefinition = new svgImageDefinition(imageURLLight, pImageID);
    patternImageDefinition.mask = patternMaskDefinition;
    // add mask and image to the SVG
    patternAlphaSVG.definitions.push(patternMaskDefinition, patternImageDefinition);
    // add SVG to image 
    patternImage.addSVG(patternAlphaSVG);
    // modify gradient 
    patternAlphaGradient.sharpness = 0.75;
    patternAlphaGradient.angle = 80;
    patternAlphaGradient.mirror = true;

    // TODO: replace multi references to an SVG shape with a use URL reference
    // Issue URL: https://github.com/nickyonge/evto-web/issues/67
    // this is a good example of using one shape multiple times that should be a <use> shape ref 
    // eg, if a rect is already defined (let myRect = new svgRect) and it gets added to multiple
    // assets (mySVGAsset1.shape = myRect; mySVGAsset2.shape = myRect), it should only be actually
    // DEFINED once. Adding it should check if it's already defined and, if so, use the <use> shape
    // type to reference it, instead of adding it repeatedly (effectively causing multiple shapes
    // with the same ID to be added)

}

function CreateColorsSection(section) {
}


function SelectPatternPage(num) {
    currentSectionNum = num;
    let activePage = num == 0 ? sectionPattern : sectionColors;
    let inactivePage = num == 0 ? sectionColors : sectionPattern;
    ui.AddClassesToDOM(activePage, 'active');
    ui.RemoveClassesFromDOM(inactivePage, 'active');
    SetElementEnabled(activePage, true);
    SetElementEnabled(inactivePage, false);
}
