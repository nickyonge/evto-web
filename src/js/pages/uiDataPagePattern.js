import * as cmp from "../components";
import { DemoPageContent } from "./uiDataPageBase";
import * as ui from '../ui';
import { SetElementEnabled } from "../lilutils";

let patternPage = 0;

let sectionContainer;
let sectionPattern;
let sectionColors;

/** Create the Pattern & Colours page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE -----
    // DemoPageContent(page);

    // create div selection bar
    let sectionSelection = new cmp.MutliOptionList('', SelectPatternPage, ['Pattern', 'Colours'], null, null, patternPage, true);

    // create page divs
    sectionContainer = ui.CreateDivWithClass('sectionContainer');
    sectionPattern = ui.CreateDivWithClass('section', 'pattern');
    sectionColors = ui.CreateDivWithClass('section', 'colors');

    // demo content
    sectionPattern.innerHTML = "PATTERN";
    sectionColors.innerHTML = "COLOURS";
    sectionPattern.appendChild(new cmp.Toggle());
    sectionPattern.appendChild(new cmp.Toggle());
    sectionPattern.appendChild(new cmp.Toggle());
    sectionColors.appendChild(new cmp.Toggle());
    sectionColors.appendChild(new cmp.Toggle());
    sectionColors.appendChild(new cmp.Toggle());

    // add elements to page 
    page.appendChild(sectionSelection);
    page.appendChild(sectionContainer);
    sectionContainer.appendChild(sectionPattern);
    sectionContainer.appendChild(sectionColors);

    // initialize 
    SelectPatternPage(patternPage);
}

function SelectPatternPage(num) {
    patternPage = num;
    let activePage = num == 0 ? sectionPattern : sectionColors;
    let inactivePage = num == 0 ? sectionColors : sectionPattern;
    ui.AddClassesToDOM(activePage, 'active');
    ui.RemoveClassesFromDOM(inactivePage, 'active');
    SetElementEnabled(activePage, true);
    SetElementEnabled(inactivePage, false);
}
