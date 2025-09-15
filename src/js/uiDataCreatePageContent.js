// script to create internal content on each page in the data window
// just didn't like how long uiData.js was getting
import * as ui from "./ui";
import * as txt from './text';
import { Toggle, MutliOptionList, DropdownList, TextField } from "./components";
// import { Toggle, MutliOptionList, DropdownList } from "./components/base";
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE } from "./contentData";
import { GetPageNumberByID } from "./uiData";

function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let p1 = ui.CreateElement('p');
    p1.innerHTML = "Lorem ipsum doler set amit";
    page.appendChild(p1);
}
function CreatePageSize(page) {
    // ----------------------------- CREATE SIZE PAGE -----
    
    let txInfo = new TextField(txt.LIPSUM);
    page.appendChild(txInfo.div);

    let moSize = new MutliOptionList('Size', null,
        [
            `${txt.SIZE_SM}, <i>10x20"</i>`,
            `&nbsp;&nbsp;${txt.SIZE_SMP}, <i>12x24"</i>`,
            `${txt.SIZE_MD}, <i>16x32"</i>`,
            `&nbsp;&nbsp;${txt.SIZE_MDP}, <i>18x36"</i>`,
            `${txt.SIZE_LG}, <i>20x40"</i>`,
            `&nbsp;&nbsp;${txt.SIZE_LGP}, <i>24x48"</i>`,
        ], [1, 2, 3, 4, 5, 6]);
    page.appendChild(moSize.div);

}
function CreatePageFeatures(page) {
    // ----------------------------- CREATE FEATURES PAGE ----- 
    DemoPageContent(page);
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

    // universal page header
    let header = ui.CreateElement('h2');
    header.innerHTML = txt.PAGE_TITLES[GetPageNumberByID(page.id)];
    page.appendChild(header);

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

function DemoPageContent(page) {

    // let dd = new DropdownList('dropdown', dCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam']);
    let dd1 = new DropdownList('dropdown1', dCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam'], [1, null, 0]);
    let dd = new DropdownList('dropdown2', dCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam', 'a', 'b', 'c', '1235387235897293859823598729387592359792837598', 'test', 'ewbai']);
    // function dCallback() { console.log(`changed: ${dd.selection}`); }
    function dCallback(selection) { console.log(`changed: ${selection}`); }
    page.appendChild(dd1.div);
    page.appendChild(dd.div);

    let mo = new MutliOptionList('multi', mCallback, ['a', 'b', 'c'], [1, 2, 3]);
    function mCallback() { console.log(`changed: ${mo.selection}`); }
    // function mCallback(selection) { console.log(`changed: ${selection}`); }
    page.appendChild(mo.div);

    let tg = new Toggle("toggle", tCallback, 0);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    function tCallback(checked) { console.log('checked: ' + checked); }
    page.appendChild(tg.div);
    let tg2 = new Toggle("toggle2", tCallback, 0);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    page.appendChild(tg2.div);
}
