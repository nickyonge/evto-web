// script to create internal content on each page in the data window
// just didn't like how long uiData.js was getting
import * as ui from "./ui";
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE } from "./contentData";

function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let header = ui.CreateElement('h2');
    header.innerText = "Hello World";

    let p1 = ui.CreateElement('p');
    p1.innerText = "Lorem ipsum doler set amit";

    page.appendChild(header);
    page.appendChild(p1);

}
function CreatePageSize(page) {
    // ----------------------------- CREATE SIZE PAGE ----- 
}
function CreatePageFeatures(page) {
    // ----------------------------- CREATE FEATURES PAGE ----- 
}
function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE ----- 
}
function CreatePageSave(page) {
    // ----------------------------- CREATE SAVE & LOAD PAGE ----- 
}

/**
 * Creates the content in a page itself, using the page's `id` to determine page type.
 * @param {HTMLElement} page Element of the page itself 
 */
export function CreatePageContent(page) {
    // add unique page content 

    // nullcheckery 
    if (!page) {
        throw new Error("ERROR: can't CreatePageContent, page is null");
    } else if (!page.id) { throw new Error(`ERROR: can't CreatePageContent, page.id is null, page: ${page}`); }

    // separate functions for each so I don't have to worry about variable name conflicts 
    switch (page.id) {
        case PG_INTRO:
            CreatePageIntro(page);
            break;
        case PG_SIZE:
            CreatePageSize(page);
            break;
        case PG_FEATURES:
            CreatePageFeatures(page);
            break;
        case PG_PATTERN:
            CreatePagePattern(page);
            break;
        case PG_SAVE:
            CreatePageSave(page);
            break;

        default:
            throw new Error(`ERROR: invalid page ID, can't create page content. Page ID: ${page.id}, index: ${i}`);

    }
}