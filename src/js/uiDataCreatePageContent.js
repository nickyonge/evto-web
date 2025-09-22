// script to create internal content on each page in the data window
// just didn't like how long uiData.js was getting
import * as ui from "./ui";
import * as txt from './text';
import * as cost from './costs';
import { currentSize, Size } from "./contentData";
import { Toggle, MutliOptionList, DropdownList, TextField } from "./components";
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE } from "./contentData";
import { GetPageNumberByID, pageComponents, pageHeaders } from "./uiData";
import { GetAllChildrenWithClass } from "./lilutils";
import { basicComponentClass } from "./components/base";

const languageDropdown = false;

function CreatePageIntro(page) {
    // ----------------------------- CREATE INTRO PAGE -----
    let p1 = ui.CreateElement('p');
    p1.innerHTML = txt.LIPSUM;
    page.appendChild(p1);
}
function CreatePageSize(page) {
    // ----------------------------- CREATE SIZE PAGE -----

    let txInfo = new TextField(txt.LIPSUM);
    page.appendChild(txInfo.div);

    let sm = cost.GetCostArrayForSize(cost.SIZE_CANVAS, Size.Small);
    let md = cost.GetCostArrayForSize(cost.SIZE_CANVAS, Size.Medium);
    let lg = cost.GetCostArrayForSize(cost.SIZE_CANVAS, Size.Large);

    let moSize = new MutliOptionList('Size', null,
        [ // sizing and labels 
            `${txt.PG_SIZE_SM}, <i>${txt.DATA_SIZE_SM}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_SMP}, <i>${txt.DATA_SIZE_SMP}</i>`,
            `${txt.PG_SIZE_MD}, <i>${txt.DATA_SIZE_MD}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_MDP}, <i>${txt.DATA_SIZE_MDP}</i>`,
            `${txt.PG_SIZE_LG}, <i>${txt.DATA_SIZE_LG}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_LGP}, <i>${txt.DATA_SIZE_LGP}</i>`,
        ],
        [ // costs 
            sm[0], sm[1],
            md[0], md[1],
            lg[0], lg[1]
        ]);
    page.appendChild(moSize.div);

}
function CreatePageFeatures(page) {
    // ----------------------------- CREATE FEATURES PAGE -----

    let featuresGrid = ui.CreateDivWithClass('grid');
    page.appendChild(featuresGrid);

    let moLandDetail = new MutliOptionList(
        txt.PG_FEAT_LANDDETAIL, null,
        txt.PG_FEAT_LANDDETAIL_OPTIONS,
        null, 0
    );
    let moGCSLines = new MutliOptionList(
        txt.PG_FEAT_GCSLINES, null,
        txt.PG_FEAT_GCSLINES_OPTIONS,
        [1, 2, 3],
        null, 0
    );
    let moLabelling = new MutliOptionList(
        txt.PG_FEAT_LABELLING, null,
        txt.PG_FEAT_LABELLING_OPTIONS,
        [1, 2, 3],
        null, 0
    );
    let moTitleBox = new MutliOptionList(
        txt.PG_FEAT_TITLEBOX, null,
        txt.PG_FEAT_TITLEBOX_OPTIONS,
        [1, 2, 3],
        null, 0
    );
    let moLandLines = new MutliOptionList(
        txt.PG_FEAT_LANDLINES, null,
        txt.PG_FEAT_LANDLINES_OPTIONS,
        [1, 2, 3, 4, 5],
        null, 0
    );

    featuresGrid.appendChild(moLandDetail.div);
    featuresGrid.appendChild(moGCSLines.div);
    featuresGrid.appendChild(moLabelling.div);
    featuresGrid.appendChild(moTitleBox.div);
    featuresGrid.appendChild(moLandLines.div);

    if (languageDropdown) {
        let ddLanguage = new DropdownList(
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
