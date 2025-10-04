import * as cmp from "../components";
import { DemoPageContent } from "./uiDataPageBase";
import * as ui from '../ui';

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
    ui.AddClassToDOMs('active', num == 0 ? sectionPattern : sectionColors);
    ui.RemoveClassFromDOMs('active', num == 0 ? sectionColors : sectionPattern);
}
