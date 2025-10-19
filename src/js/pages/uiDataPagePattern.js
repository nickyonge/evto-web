import * as cmp from "../components";
import * as ui from '../ui';
import * as txt from '../text';
import { SetElementEnabled } from "../lilutils";
import { DemoGradient } from "./uiDataPageBase";

let currentSectionNum = 0;

let sectionContainer;
let sectionPattern;
let sectionColors;

/** Create the Pattern & Colours page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE -----
    // DemoPageContent(page);

    let a = [];
    a.onChange = function (a, b, ...c) { console.log("hell yeah, " + a + ", " + b + ", " + c.length); console.log(c); }
    a.push(1,2,3);


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

    DemoGradient(sectionPattern);


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

function SelectPatternPage(num) {
    currentSectionNum = num;
    let activePage = num == 0 ? sectionPattern : sectionColors;
    let inactivePage = num == 0 ? sectionColors : sectionPattern;
    ui.AddClassesToDOM(activePage, 'active');
    ui.RemoveClassesFromDOM(inactivePage, 'active');
    SetElementEnabled(activePage, true);
    SetElementEnabled(inactivePage, false);
}
