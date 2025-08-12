/* UI elements for the Data window - tabs, selection buttons, etc */

import * as ui from "./ui";
import * as txt from './text';
import { dataWindow } from "./uiMain";
import { style, AddAlphaToHex } from "./lilutils";

// import iconArt from '../assets/svg/icons-currentColor/icon-art.svg';
// import iconFeatures from '../assets/svg/icons-currentColor/icon-features.svg';
// import iconHome from '../assets/svg/icons-currentColor/icon-home.svg';
// import iconSave from '../assets/svg/icons-currentColor/icon-save.svg';
// import iconScale from '../assets/svg/icons-currentColor/icon-scale.svg';

// import iconArt from '../assets/svg/icons-white/icon-art.svg';
// import iconFeatures from '../assets/svg/icons-white/icon-features.svg';
// import iconHome from '../assets/svg/icons-white/icon-home.svg';
// import iconSave from '../assets/svg/icons-white/icon-save.svg';
// import iconScale from '../assets/svg/icons-white/icon-scale.svg';

import iconArt from '../assets/svg/icons-red/icon-art.svg';
import iconFeatures from '../assets/svg/icons-red/icon-features.svg';
import iconHome from '../assets/svg/icons-red/icon-home.svg';
import iconSave from '../assets/svg/icons-red/icon-save.svg';
import iconScale from '../assets/svg/icons-red/icon-scale.svg';

export const initialTab = 0;
const bgFadeAlpha = 0.82;

const useSeparators = false;

const iconArray = [iconHome, iconScale, iconFeatures, iconArt, iconSave];
const tabColors = ['red', 'orange', 'blue', 'green', 'purple'];
const pageNames = ['intro', 'size', 'features', 'pattern', 'save'];

let currentPage = -1;

let pages = [];

/**
 * Create the data window (tabs, options, info)
 */
export function CreateDataWindow() {
    // create UI elements
    CreateTabs();
    CreatePages();
    CreateFadeBG();
}


/**
 * 
 * @param {number} tabNum number of tab/page to select
 * @param {boolean} snap skip animation / timing? default false 
 */
export function SelectTab(tabNum, snap = false) {
    if (tabNum == currentPage && !snap) { return; }
    currentPage = tabNum;
    for (let i = 0; i < txt.TABS_NUM; i++) {
        let currentTab = i == tabNum;
        let tabId = 'tab' + i;
        let tabInput = document.querySelector(`input[id=${tabId}]`);
        let page = pages[i];

        if (currentTab) {
            let tabColor = tabColors[i];
            let cssColor = GetBGColor(tabColor);
            cssColor = AddAlphaToHex(cssColor, bgFadeAlpha);
            // console.log(`Tab ID: ${tabId}, tabColor: ${tabColor}, cssColor: ${cssColor}`);
            dataWindow.style.setProperty('background-color', cssColor);

            page.style.setProperty('transition', 'opacity 0.5s ease-out');
            page.style.opacity = '1';
            
        } else {
            page.style.setProperty('transition', 'opacity 0.1s ease-out');
            page.style.opacity = '0';
        }

        if (snap) {
            // snap to initial state
            if (i == tabNum) {
                tabInput.checked = true;
            } else {
                tabInput.checked = false;
            }
        }
    }
}

function GetBGColor(color) {
    let cssVar = '--color-data-bg-blend-' + color;
    let cssColor = style.value.getPropertyValue(cssVar);
    if (!cssColor) {
        throw new Error(`ERROR: couldn't get CSS variable for BG color: ${color}, parsed to CSS var ${cssVar}`);
    }
    return cssColor;
}


function CreateTabs() {
    let tabs = ui.CreateDivWithClass('tabs');
    for (let i = 0; i < txt.TABS_NUM; i++) {
        // create individual tabs, based off TABS array in text.js
        let tab = 'tab' + i;
        let tabInput = ui.CreateElement('input'); // input element
        ui.AddElementAttributes(tabInput,
            ['type', 'id', 'name'],
            ['radio', tab, 'tab']);
        // create label 
        let tabLabel = ui.CreateElementWithClass('label', tabColors[i]); // label element
        // check for separators
        if (useSeparators && i != txt.TABS_NUM - 1) {
            ui.AddClassToDOMs('separator', tabLabel);
        }
        ui.AddElementAttribute(tabLabel, 'for', tab);
        ui.MakeTabbableWithInputTo(tabLabel, tabInput);
        // tab text and icon
        let tabText = ui.CreateDivWithClass('text', tabColors[i]);
        tabText.innerText = txt.TABS[i];
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

function CreatePages() {
    // create pages content container
    let content = ui.CreateDivWithClass('content');
    dataWindow.appendChild(content);
    // create pages
    for (let i = 0; i < txt.TABS_NUM; i++) {
        let page = ui.CreateDivWithClass('page', pageNames[i], tabColors[i]);
        page.id = `page${i}`; // page ID is numeric
        // page.id = pageNames[i]; // page ID is named
        ui.AddElementAttribute(page, 'z-index', i + 1);
        pages.push(page);
        content.appendChild(page);
        page.innerText = `Page Test, PG${i}`;

    }
}

function CreateFadeBG() {
    // create fade bg
    let fadeBG = ui.CreateDivWithClass('fadeBG');
    dataWindow.appendChild(fadeBG);
}