/* UI elements for the Data window - tabs, selection buttons, etc */

import * as ui from "./ui";
import * as txt from './text';
import { PAGE_NAMES } from "./text";
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE, PageOpened, PageClosed } from "./contentData";
import { dataWindow } from "./uiMain";
import { style, AddAlphaToHex, DeselectElement, SetElementEnabled, GetChildWithClass, GetAllChildrenWithClass } from "./lilutils";
import { CreatePage } from "./pages/uiDataPageBase";
import { CallOnLoadComplete } from ".";
import { BasicComponent, basicComponentClass } from "./components/base";

import iconArt from '../assets/svg/icons-red/icon-art.svg';
import iconFeatures from '../assets/svg/icons-red/icon-features.svg';
import iconHome from '../assets/svg/icons-red/icon-home.svg';
import iconSave from '../assets/svg/icons-red/icon-save.svg';
import iconScale from '../assets/svg/icons-red/icon-scale.svg';


export const initialTab = 3;

const maxTitleHeight = 30;
const maxTwoColumnWidthDefault = 269;
const bgFadeAlpha = 0.82;
const useSeparators = false;

const iconArray = [iconHome, iconScale, iconFeatures, iconArt, iconSave];
const tabColors = ['red', 'orange', 'blue', 'green', 'purple'];
const pageIDs = [PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE];

let currentPage = -1;

let tabs;
let content;
let pages = [];

/** array of all headers for each of the pages 
 @type {HTMLElement[]} 
 */
export let pageHeaders = [];
/** 2D array of components arragned per page, 
 * eg [0] is an array of components found on page 0, etc 
 @type {Array<Array<BasicComponent>>}
 @see {@link BasicComponent.allComponents}, static array of all loaded components 
 */
export let perPageComponents = [];


// ----------------------------------------------------- UI CREATION ----- 

/** Create the data window (tabs, options, info) */
export function CreateDataWindow() {
    // create UI elements
    CreateTabs();
    CreatePages();
    CreateFadeBG();
}

/** Creates the tabs sidebar for the data window to switch between pages */
function CreateTabs() {
    tabs = ui.CreateDivWithClass('tabs');
    for (let i = 0; i < txt.PAGES_COUNT; i++) {
        // create individual tabs, based off TABS array in text.js
        let tab = 'tab' + i;
        let tabInput = ui.CreateElement('input'); // input element
        ui.AddElementAttributes(tabInput,
            ['type', 'id', 'name'],
            ['radio', tab, 'tab']);
        // create label 
        let tabLabel = ui.CreateElementWithClass('label', tabColors[i]); // label element
        // check for separators
        if (useSeparators && i != txt.PAGES_COUNT - 1) {
            ui.AddClassToDOMs('separator', tabLabel);
        }
        ui.AddElementAttribute(tabLabel, 'for', tab);
        ui.MakeTabbableWithInputTo(tabLabel, tabInput);
        // tab text and icon
        let tabText = ui.CreateDivWithClass('text', tabColors[i]);
        tabText.innerText = txt.PAGE_NAMES[i];
        let tabIcon = ui.CreateImage(iconArray[i]);
        ui.AddClassesToDOM(tabIcon, 'icon', tabColors[i]);
        tabLabel.appendChild(tabText);
        tabLabel.appendChild(tabIcon);
        // add tab elements to tabs list
        tabs.appendChild(tabInput);
        tabs.appendChild(tabLabel);
    }
    // tabs marker
    let marker = ui.CreateDivWithClass('tabMarker');
    marker.appendChild(ui.CreateDivWithID('tmTop'));
    marker.appendChild(ui.CreateDivWithID('tmBottom'));
    tabs.appendChild(marker);
    // add to window
    dataWindow.appendChild(tabs);
}

/**
 * Creates the individual pages for the data window.
 * 
 * NOTE: See `uiDataPageBase.js` for creation of the actual content 
 * in the pages themselves (text, buttons, sliders, graphics, etc)
 */
function CreatePages() {
    // create pages content container
    content = ui.CreateDivWithClass('content');
    dataWindow.appendChild(content);
    // create pages
    pages = [];
    pageHeaders = [];
    perPageComponents = [];
    for (let i = 0; i < txt.PAGES_COUNT; i++) {
        let page = ui.CreateDivWithClass('page', pageIDs[i], tabColors[i]);
        // page.id = `page${i}`; // page ID is numeric
        page.id = pageIDs[i]; // page ID is named
        ui.AddElementAttribute(page, 'z-index', i + 1);
        pages.push(page);
        content.appendChild(page);
        // external page content creation function
        CreatePage(page);
    }
    // add resize event 
    window.addEventListener('resize', function () {
        // resize pages 
        UpdatePages()
    });
    // callback on added
    CallOnLoadComplete(PagesCreated);
}

/** creates the gradient fade element that sits atop the solid colour background */
function CreateFadeBG() {
    let fadeBG = ui.CreateDivWithClass('fadeBG');
    dataWindow.appendChild(fadeBG);
}

// ------------------------------------- SPECIFIC METHODS ----------------

function PagesCreated() {
    perPageComponents = new Array(pages.length);
    pages.forEach(page => {
        // record all components 
        let pageNumber = GetPageNumberByID(page.id);
        let componentDivs = GetAllChildrenWithClass(page, basicComponentClass);
        let components = [];
        for (let i = 0; i < componentDivs.length; i++) {
            components.push(BasicComponent.GetComponentByDiv(componentDivs[i]));
        }
        perPageComponents[pageNumber] = components;
        page.addEventListener('scroll', OnScroll);
    });
    UpdatePages();
}

function OnScroll(e) {
    let pageNumber = GetPageNumberByID(e.target.id);
    perPageComponents[pageNumber].forEach(component => {
        if (component.onScroll) {
            component.onScroll();
        }
    });
}

function UpdatePages() {
    UpdatePageLayouts();
    UpdatePageTitles();
}
function UpdatePageLayouts() {
    // iterate thru all pages looking for grids
    for (let i = 0; i < pages.length; i++) {
        let gridLayout = GetChildWithClass(pages[i], 'grid');
        if (gridLayout) {
            // found grid, check for single column, first checking aspect attb
            let singleColumn = false;
            let maxAspect = ui.GetAttribute(gridLayout, 'maxGridAspect');
            if (maxAspect) {
                // aspect ratio found, compare to content aspect
                let contentAspect = content.offsetWidth / content.offsetHeight;
                singleColumn = contentAspect < maxAspect;
            }
            if (!singleColumn) {
                // no aspect, check for max grid width attb, or use default max width
                let maxWidth = ui.GetAttribute(gridLayout, 'maxGridWidth');
                if (maxWidth == null) { maxWidth = maxTwoColumnWidthDefault; }
                // check if single column
                singleColumn = content.offsetWidth < maxWidth;
            }
            ui.AddElementAttribute(gridLayout, 'singleColumn', singleColumn);
        }
    }
}

function UpdatePageTitles() {
    // update the title, and iterate thru alt shorter titles 
    //   until a single-line one is found
    for (let i = 0; i < pageHeaders.length; i++) {
        pageHeaders[i].innerHTML = txt.PAGE_TITLES[i];
        pageHeaders[i].style.whiteSpace = 'normal';
        if (TooTall()) {
            for (let j = 0; j < txt.PAGE_TITLES_SHORTER[i].length; j++) {
                pageHeaders[i].innerHTML = txt.PAGE_TITLES_SHORTER[i][j];
                if (j == txt.PAGE_TITLES_SHORTER[i].length - 1) {
                    pageHeaders[i].style.whiteSpace = 'nowrap';
                } else {
                    if (!TooTall()) {
                        break;
                    }
                }
            }
        }
        // determine if height is too tall 
        function TooTall() {
            return pageHeaders[i].offsetHeight > maxTitleHeight;
        }
    }
}

// ------------------------------------- UI SELECTION AND NAVIGATION ----- 

/**
 * Select the current tab and switch to its corresponding page
 * @param {number} tabNum number of tab/page to select
 * @param {boolean} snap skip animation / timing? default false 
 */
export function SelectTab(tabNum, snap = false) {
    if (tabNum == currentPage && !snap) { return; }
    let lastPage = currentPage;
    currentPage = tabNum;
    if (lastPage == -1) {
        // first open 
        console.log(`Opening initial page: ${PAGE_NAMES[currentPage]}`);
    } else {
        // subsequent open 
        console.log(`Closing ${PAGE_NAMES[lastPage]} page, opening ${PAGE_NAMES[currentPage]} page`)
    }
    for (let i = 0; i < txt.PAGES_COUNT; i++) {
        let currentTab = i == tabNum;
        let tabId = 'tab' + i;
        let tabInput = document.querySelector(`input[id=${tabId}]`);
        let page = pages[i];

        if (currentTab) {
            // logic current tab/page being displayed, not others 
            let tabColor = tabColors[i];
            let cssColor = GetBGColor(tabColor);
            cssColor = AddAlphaToHex(cssColor, bgFadeAlpha);
            dataWindow.style.setProperty('background-color', cssColor);
            // enable page elements, fade in
            SetElementEnabled(page, true);
            page.style.setProperty('transition', 'opacity 0.5s ease-out');
            page.style.opacity = '1';
            PageOpened(page, snap);
        } else {
            // non-active tab, disable page elements, fade out 
            if (lastPage == i) {
                // recently closed page
            }
            SetElementEnabled(page, false);
            page.style.setProperty('transition', 'opacity 0.1s ease-out');
            page.style.opacity = '0';
            PageClosed(page);
        }

        if (snap) {
            // snap to target state
            if (i == tabNum) {
                tabInput.checked = true;
            } else {
                tabInput.checked = false;
            }
            // TODO: snap directly to final state (noticeable when using non-0 initial tab)
            // Issue URL: https://github.com/nickyonge/evto-web/issues/17
        }
    }
}


// --------------------------------------------------------- GETTERS ----- 

/**
 * Reference function. PageName must be one of the values found in `pageNames`. Gets that page's index
 * @param {string} pageID ID of the page, must correspond to something in `pageIDs`
 * @returns {number} array index of `pageName` in `pageNames`
 */
export function GetPageNumberByID(pageID) {
    for (let i = 0; i < pageIDs.length; i++) {
        if (pageIDs[i] == pageID) {
            return i;
        }
    }
    throw new Error(`Could not find page number for page name ${pageID}, check spelling. PageNames array: ${pageIDs}`);
}

/**
 * Gets the color associated with the given `tabColors` value for window BGs
 * @param {string} color Color name, see `tabColors` 
 * @returns {string} Color in hex code `#ABCDEF` format, from CSS vars
 */
function GetBGColor(color) {
    let cssVar = '--color-data-bg-blend-' + color;
    let cssColor = style.value.getPropertyValue(cssVar);
    if (!cssColor) {
        throw new Error(`ERROR: couldn't get CSS variable for BG color: ${color}, parsed to CSS var ${cssVar}`);
    }
    return cssColor;
}