import * as cmp from "../components";
import * as ui from '../ui';
import * as txt from '../text';
import { ColorToArray, ColorToRGBA, EnsureColorValid, isBlank, SetElementEnabled, StringToNumber } from "../lilutils";
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

const imageURLLight = mapImg.full.monochrome.light.URL;
const imageURLDark = mapImg.full.monochrome.dark.URL;

function CreatePatternSection(section) {
    let patternImage = new cmp.ImageField();
    section.appendChild(patternImage);

    patternImage.addImage(imageURLDark);
    let alphaLayer1 = new cmp.ImageAlphaLayer(1, imageURLLight, patternImage);
    alphaLayer1.gradient.sharpness = 0.5;

    let sharpness = new cmp.Slider('Sharpness',
        (value) => { alphaLayer1.gradient.sharpness = value; },
        alphaLayer1.gradient.sharpness, 0, 1, true, 0.01);
    sharpness.AddUniqueValueOverride(0.69, 'Nice');

    let angle = new cmp.Slider('Rotation',
        (value) => { alphaLayer1.gradient.angle = value; },
        alphaLayer1.gradient.angle, 0, 360, false, 1);
    angle.valueSuffix = '°';
    angle.uniqueValueOverrides = [[0, 'None'], [69, 'Nice'], [90, 'Quarter'], [180, 'Half'], [270, 'Three-Quarter'], [360, 'Full']];

    let scale = new cmp.Slider('Scale',
        (value) => { alphaLayer1.gradient.scale = value; },
        alphaLayer1.gradient.scale, -2, 2, true, 0.05);
    scale.AddUniqueValueOverride(0.69, 'Nice');
    scale.percentageMin = -200;
    scale.percentageMax = 200;

    let pivot = new cmp.Slider('Scale Pivot',
        (value) => { alphaLayer1.gradient.scalePivot = value; },
        alphaLayer1.gradient.scalePivot, 0, 100, false, 1);
    pivot.AddUniqueValueOverride(69, 'Nice');

    let offset = new cmp.Slider('Offset',
        (value) => { alphaLayer1.gradient.offset = value; },
        alphaLayer1.gradient.offset, -100, 100, false, 1);
    offset.AddUniqueValueOverride(69, 'Nice');

    let mirror = new cmp.Toggle('Mirror',
        (value) => { alphaLayer1.gradient.mirror = value; },
        null,
        alphaLayer1.gradient.mirror
    );

    alphaLayer1.gradient.anglePivotPoint = { x: 50, y: 50 };

    // alphaLayer1.gradient.isRadial = true;

    let fx = new cmp.Slider('fx', (value) => { alphaLayer1.gradient.fx = `${value}%`; }, StringToNumber(alphaLayer1.gradient.fx));
    let fy = new cmp.Slider('fy', (value) => { alphaLayer1.gradient.fy = `${value}%`; }, StringToNumber(alphaLayer1.gradient.fy));
    let cx = new cmp.Slider('cx', (value) => { alphaLayer1.gradient.cx = `${value}%`; }, StringToNumber(alphaLayer1.gradient.cx));
    let cy = new cmp.Slider('cy', (value) => { alphaLayer1.gradient.cy = `${value}%`; }, StringToNumber(alphaLayer1.gradient.cy));
    let fr = new cmp.Slider('fr', (value) => { alphaLayer1.gradient.fr = `${value}%`; }, StringToNumber(alphaLayer1.gradient.fr));
    let r = new cmp.Slider('r', (value) => { alphaLayer1.gradient.r = `${value}%`; }, StringToNumber(alphaLayer1.gradient.r));

    section.appendChild(sharpness);
    section.appendChild(angle);
    section.appendChild(scale);
    // section.appendChild(pivot);
    section.appendChild(offset);
    section.appendChild(mirror);

    section.appendChild(fx);
    section.appendChild(fy);
    section.appendChild(cx);
    section.appendChild(cy);
    section.appendChild(fr);
    section.appendChild(r);

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
