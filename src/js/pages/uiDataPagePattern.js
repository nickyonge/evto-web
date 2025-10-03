import * as cmp from "../components";
import { DemoPageContent } from "./uiDataPageBase";

/** Create the Pattern & Colours page
 * @param {HTMLElement} page Element of the page itself */
export function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE -----
    // DemoPageContent(page);
    
    let sectionSelection = new cmp.MutliOptionList('', null, ['Pattern', 'Colours'], null, null, 0, true);
    page.appendChild(sectionSelection);

}