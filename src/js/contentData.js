/* functiionality related to the Data window */

import * as txt from './text';
import { StringToNumber } from "./lilutils";
import { dataWindow } from './uiMain';
import { initialTab, SelectTab } from './uiData';
import { BasicComponent } from './components/base';

/**
 * Canvas Sizes Enum
 */
export const Size = Object.freeze({
    SM: 0,
    MD: 1,
    LG: 2,
    Small: 0,
    Medium: 1,
    Large: 2
});

// IDs / technical names for each page, as consts here so they're not hardcoded all higgledy piggledy 
export const PG_INTRO = 'intro', PG_SIZE = 'size', PG_FEATURES = 'features', PG_PATTERN = 'pattern', PG_SAVE = 'save';

/** Current user-selected {@link Size} of the canvas 
 * @type {Size} */
export let currentSize = Size.Small;
/** Is user-select current size plus sized? 
 * @type {boolean} @see {@link Size} */
export let currentPlusSized = false;
/** Raw number for {@link currentSize}, 0=SM,1=SMP,2=MD,3=MDP,4=LG,5=LGP
 * @type {Number} */
export let currentSizeNumber = 0;

export function SetupDataWindow() {
    // select initial tab
    SelectTab(initialTab, true);
    // create events for changing tabs
    document.querySelectorAll('input[name="tab"]').forEach(tab => {
        tab.addEventListener('change', () => {
            const selected = document.querySelector('input[name="tab"]:checked');
            SelectTab(StringToNumber(selected.id));
        });
    });
}

export function SelectSize(selectedSize) {
    currentSizeNumber = selectedSize;
    currentSize = NumberToSize(selectedSize, true);
    currentPlusSized = IsPlusSizeNumber(selectedSize);
    BasicComponent.allComponents.forEach(component => {
        if (component.UpdateCosts) {
            component.UpdateCosts();
        }
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

/**
 * Get {@link Size} of canvas from the given number input 
 * @param {Number} num canvas size num, should be 0-2 (or 0-5 if including plus sizing)
 * @param {boolean} [includePlusSizing = false] include plus sizing? Eg, 0/1 = small, 2/3 = md, 4/5 = lg 
 * @returns {Size} Size enum for canvas, or null if `num` is invalid 
 */
function NumberToSize(num, includePlusSizing = false) {
    switch (num) {
        case 0:
            return Size.SM;
        case 1:
            return includePlusSizing ? Size.SM : Size.MD;
        case 2:
            return includePlusSizing ? Size.MD : Size.LG;
        case 3:
            if (includePlusSizing) { return Size.MD; }
            break;
        case 4:
            if (includePlusSizing) { return Size.LG; }
            break;
        case 5:
            if (includePlusSizing) { return Size.LG; }
            break;
    }
    console.warn(`WARNING: invalid size num ${num}, can't parse to Size, inclPlusSize: ${includePlusSizing}, returning null`);
    return null;
}
/**
 * Is given size number plus sizing? 
 * 0=SM,1=SMP,2=MD,3=MDP,4=LG,5=LGP, so 1/3/5=true, else=false
 * @param {Number} num size number value 
 * @returns {boolean}
 */
function IsPlusSizeNumber(num) {
    switch (num) {
        case 1:
        case 3:
        case 5:
            return true;
    }
    return false;
}

export function GetCurrentSizeNumberWithPlus() {
    switch (currentSize) {
        case Size.SM:
        case Size.Small:
            return currentPlusSized ? 1 : 0;
        case Size.MD:
        case Size.Medium:
            return currentPlusSized ? 3 : 2;
        case Size.LG:
        case Size.Large:
            return currentPlusSized ? 5 : 4;
    }
    console.warn(`WARNING: can't get current size w/ plus, invalid values, currentSize: ${currentSize}, currentPlusSized: ${currentPlusSized}`);
    return null;
}