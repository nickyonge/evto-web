// script to create internal content on each page in the data window
// just didn't like how long uiData.js was getting
import * as ui from "./ui";
import * as txt from './text';
import * as cost from './costs';
import { currentSize, Size, SelectSize } from "./contentData";
import * as cmp from './components';
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE } from "./contentData";
import { GetPageNumberByID, pageHeaders } from "./uiData";
import { GetAllChildrenWithClass } from "./lilutils";
import { basicComponentClass } from "./components/base";

/** show the languauges dropdown? */
const languageDropdown = false;// TODO: Languages in language dropdown 
// Issue URL: https://github.com/nickyonge/evto-web/issues/1

function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let p1 = ui.CreateElement('p');
    p1.innerHTML = txt.LIPSUM;
    page.appendChild(p1);
}
function CreatePageSize(page) {
    // ----------------------------- CREATE SIZE PAGE -----

    
    let sizeGrid = ui.CreateDivWithClass('grid');
    // ui.AddElementAttribute(sizeGrid, 'maxGridWidth', 500);
    ui.AddElementAttribute(sizeGrid, 'maxGridAspect', 1.67);
    page.appendChild(sizeGrid);

    let cs = new cmp.CanvasSize("Canvas Size");
    sizeGrid.appendChild(cs.div);

    let moSize = new cmp.MutliOptionList('Size', SelectSize,
        [ // sizing and labels 
            `${txt.PG_SIZE_SM}, <i>${txt.DATA_SIZE_SM}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_SMP}, <i>${txt.DATA_SIZE_SMP}</i>`,
            `${txt.PG_SIZE_MD}, <i>${txt.DATA_SIZE_MD}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_MDP}, <i>${txt.DATA_SIZE_MDP}</i>`,
            `${txt.PG_SIZE_LG}, <i>${txt.DATA_SIZE_LG}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_LGP}, <i>${txt.DATA_SIZE_LGP}</i>`,
        ], cost.SIZE_CANVAS);
    sizeGrid.appendChild(moSize.div);

    let txInfo = new cmp.TextField(txt.LIPSUM);
    page.appendChild(txInfo.div); // add to page directly, not grid
}
function CreatePageFeatures(page) {
    // ----------------------------- CREATE FEATURES PAGE -----

    let featuresGrid = ui.CreateDivWithClass('grid');
    page.appendChild(featuresGrid);

    let moLandDetail = new cmp.MutliOptionList(
        txt.PG_FEAT_LANDDETAIL, null,
        txt.PG_FEAT_LANDDETAIL_OPTIONS,
        cost.FEAT_LANDDETAIL,
        null, 0
    );
    let moGCSLines = new cmp.MutliOptionList(
        txt.PG_FEAT_GCSLINES, null,
        txt.PG_FEAT_GCSLINES_OPTIONS,
        cost.FEAT_GCSLINES,
        null, 0
    );
    let moLabelling = new cmp.MutliOptionList(
        txt.PG_FEAT_LABELLING, null,
        txt.PG_FEAT_LABELLING_OPTIONS,
        cost.FEAT_LABELLING,
        null, 0
    );
    let moTitleBox = new cmp.MutliOptionList(
        txt.PG_FEAT_TITLEBOX, null,
        txt.PG_FEAT_TITLEBOX_OPTIONS,
        cost.FEAT_TITLEBOX,
        null, 0
    );
    let moLandLines = new cmp.MutliOptionList(
        txt.PG_FEAT_LANDLINES, null,
        txt.PG_FEAT_LANDLINES_OPTIONS,
        cost.FEAT_LANDLINES,
        null, 0
    );

    featuresGrid.appendChild(moLandDetail.div);
    featuresGrid.appendChild(moGCSLines.div);
    featuresGrid.appendChild(moLabelling.div);
    featuresGrid.appendChild(moTitleBox.div);
    featuresGrid.appendChild(moLandLines.div);

    if (languageDropdown) {
        let ddLanguage = new cmp.DropdownList(
            txt.PG_FEAT_LANGUAGE, null,
            txt.PG_FEAT_LANGUAGE_OPTIONS,
            null, null, 0
        );
        featuresGrid.appendChild(ddLanguage.div);
    }
}
function CreatePagePattern(page) {
    // ----------------------------- CREATE COLOUR & PATTERN PAGE ----- 
    DemoPageContent(page);
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

    let pageNumber = GetPageNumberByID(page.id);

    // universal page header
    let header = ui.CreateElement('h2');
    header.innerHTML = '';
    pageHeaders.push(header);
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

    function ddCallback(selection) { console.log(`changed: ${selection}`); }
    function cpCallback(color, colorPicker) { console.log(`color changed, ${color}, colorPicker: ${colorPicker.uniqueComponentName}`); }
    // function dCallback() { console.log(`changed: ${dd.selection}`); }

    let cp1 = new cmp.ColorPicker('color picker 1', null, '#ffbb00', false);
    page.appendChild(cp1.div);
    let cp2 = new cmp.ColorPicker('color picker 2', cpCallback, '#00bbff', false);
    page.appendChild(cp2.div);


    let dd1 = new cmp.DropdownList('dropdown1', ddCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam'], [[1, 2, 3], [4, null, 6], [7, 8, 9]]);
    page.appendChild(dd1.div);
    let dd2 = new cmp.DropdownList('dropdown2', ddCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam', 'a', 'b', 'c', '1235387235897293859823598729387592359792837598', 'test', 'ewbai']);
    page.appendChild(dd2.div);

    let mo = new cmp.MutliOptionList('multi', mCallback, ['a', 'b', 'c'], [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
    function mCallback() { console.log(`changed: ${mo.selection}`); }
    // function mCallback(selection) { console.log(`changed: ${selection}`); }
    page.appendChild(mo.div);

    let tg = new cmp.Toggle("toggle", tCallback, [1, 2, 3]);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    function tCallback(checked) { console.log('checked: ' + checked); }
    page.appendChild(tg.div);
    let tg2 = new cmp.Toggle("toggle2", tCallback, [99, null, 999]);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    page.appendChild(tg2.div);

}