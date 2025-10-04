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
    
}

function GetPatternPageDiv(num) {
    if (num == null || num == undefined) { num = patternPage; }
    switch (patternPage) {
        case 0:
            return sectionPattern;
        case 1:
            return sectionColors;
    }
    console.warn(`WARNING: invalid GetPatternPageDiv ${num}, returning null`);
    return null;
}