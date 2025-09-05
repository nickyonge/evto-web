/* functiionality related to the Data window */

import * as txt from './text';
import { StringToNumber } from "./lilutils";
import { dataWindow } from './uiMain';
import { initialTab, SelectTab } from './uiData';

// IDs / technical names for each page, as consts here so they're not hardcoded all higgledy piggledy 
export const PG_INTRO = 'intro', PG_SIZE = 'size', PG_FEATURES = 'features', PG_PATTERN = 'pattern', PG_SAVE = 'save';

export function SetupDataWindow() {
    // select initial tab
    SelectTab(initialTab, true);
    // create events for changing tabs
    document.querySelectorAll('input[name="tab"]').forEach(tab => {
        tab.addEventListener('change', () => {
            const selected = document.querySelector('input[name="tab"]:checked');
            console.log("MANUAL SELECT TAB");
        });
    });
}

/**
 * Called the moment a page is opened (prior to any animations firing)
 * 
 * @param {HTMLElement} page element of the given page that was just opened 
 * @param {boolean} [wasSnapped] was the page snap displayed (t) or regular transition (f)
 * 
 * NOTE: iterative call on all pages. It may come BEFORE OR AFTER `PageClosed`
 */
export function PageOpened(page, wasSnapped) {
    switch (page.id) {
        case PG_INTRO:
            break;
        case PG_SIZE:
            break;
        case PG_FEATURES:
            break;
        case PG_PATTERN:
            break;
        case PG_SAVE:
            break;
    }
}

/**
 * Called the moment a page is closed (prior to any animations firing)
 * 
 * @param {HTMLElement} page element of the given page that was just closed 
 * 
 * NOTE: iterative call on all pages. It may come BEFORE OR AFTER `PageOpened`
 */
export function PageClosed(page) {
    switch (page.id) {
        case PG_INTRO:
            break;
        case PG_SIZE:
            break;
        case PG_FEATURES:
            break;
        case PG_PATTERN:
            break;
        case PG_SAVE:
            break;
    }
}