import * as cmp from "../components";
import * as ui from '../ui';
import * as txt from '../text';
import { SetElementEnabled } from "../lilutils";

let currentSectionNum = 0;

let sectionContainer;
let sectionPattern;
let sectionColors;

let svgImage;

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

    // prepare sections
    svgImage = new cmp.SVGImage();
    sectionPattern.appendChild(svgImage);

    let slider1 = new cmp.Slider('scale', function (v) { updateParameter(0, v) }, 1, 0.25, 2.5, false, 40);
    let slider2 = new cmp.Slider('angle', function (v) { updateParameter(1, v); }, 0, 0, 360);
    let slider3 = new cmp.Slider('sharpness', function (v) { updateParameter(2, v); }, 0, 0, 1);
    let color1 = new cmp.ColorPicker('color1', function (v) { updateParameter(3, v); }, 'skyblue');
    let color2 = new cmp.ColorPicker('color2', function (v) { updateParameter(4, v); }, 'white');
    let color3 = new cmp.ColorPicker('color3', function (v) { updateParameter(5, v) }, 'pink');

    sectionPattern.appendChild(slider1);
    sectionPattern.appendChild(slider2);
    sectionPattern.appendChild(slider3);
    sectionPattern.appendChild(color1);
    sectionPattern.appendChild(color2);
    sectionPattern.appendChild(color3);
    
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

function updateParameter(paramID, value) {
    switch (paramID) {
        case 0: svgImage.rect.gradient.scale = value; break;
        case 1: svgImage.rect.gradient.angle = value; break;
        case 2: svgImage.rect.gradient.sharpness = value; break;
        case 3: svgImage.rect.gradient.SetColor(0, value); break;
        case 4: svgImage.rect.gradient.SetColor(1, value); break;
        case 5: svgImage.rect.gradient.SetColor(2, value); break;
        default:
            return;
    }
    svgImage.updateRect();
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
