import * as cmp from "../components";
import * as ui from '../ui';
import * as txt from '../text';
import { svgHTMLAsset, svgShape, svgGradient, svgRect, svgDefinition, svgViewBox, svgMaskDefinition } from "../svg/index";
import { SetElementEnabled } from "../lilutils";
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

let patternAlphaSVG;
let patternAlphaGradient;
let patternMaskDefinition;
let patternMaskRect;
let patternAlphaImage;

const pMaskID = 'patternMask';
const pImageID = 'patternMaskedImage';
const imageURL = mapImg.full.monochrome.light.URL;

function CreatePatternSection(section) {
    let patternImage = new cmp.ImageField();
    section.appendChild(patternImage);

    // basic param definitions     
    let x = 0;
    let y = 0;
    let width = 1000;
    let height = width / 2;

    // viewbox and html asset
    let viewBox = new svgViewBox(x, y, width, height);
    patternAlphaSVG = new svgHTMLAsset();
    patternAlphaSVG.viewBox = viewBox;

    // svg gradient 
    patternAlphaGradient = new svgGradient(svgGradient.templates.bw);

    let maskDef;

    const useNew = true;

    if (useNew) {
        maskDef = new svgMaskDefinition(pMaskID);
    }

    // svg mask 
    if (!useNew) {
        patternMaskDefinition = new svgDefinition(pMaskID, 'mask');
        patternMaskDefinition.AddAttribute('maskUnits', 'userSpaceOnUse');
        patternMaskRect = new svgRect(x, y, width, height, patternAlphaGradient);
        patternMaskRect.storeInDefsElement = false;
    }

    // alpha image and attributes
    patternAlphaImage = new svgDefinition(pImageID, 'image');
    patternAlphaImage.storeInDefsElement = false;
    patternAlphaImage.AddAttributes([
        ['xlink:href', imageURL],
        ['width', width.toString()],
        ['height', height.toString()],
        ['mask', `url(#${pMaskID})`],
    ]);

    // push definitions
    if (!useNew) {
        patternMaskDefinition.subDefinitions.push(patternMaskRect);
        patternAlphaSVG.definitions.push(patternAlphaGradient, patternMaskDefinition, patternAlphaImage);
    }
    
    if (useNew) {
        patternAlphaSVG.definitions.push(maskDef, patternAlphaImage);
    }

    // add SVG to page 
    patternImage.addSVG(patternAlphaSVG);

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
