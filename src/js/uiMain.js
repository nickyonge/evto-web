/* Main UI generation */

import { CreateHeaderFooter } from "./uiHdFt";
import { CreateDataWindow } from "./uiData";
import * as ui from './ui';
import { CreateArtWindow } from "./uiArt";
import { InitializeOverlay } from "./uiOverlay";

const _useDemoBGColors = false;

/** in portrait orientation, should the Data window be located on top? */
// const _dataWindowOnTop = true;
const _dataWindowOnTop = false;
/** in landscape orientation, should the Data window be located on the left? */
const _dataWindowOnLeft = true;
// const _dataWindowOnLeft = false;

/** container div for all content on the page @type Element */
let container = null;

/** Header (top bar) element @type HTMLElement */
let topBar = null;
/** Overlay container for popups/info/etc @type HTMLElement */
export let overlay = null;
/** Art window, where the canvas rendering goes @type HTMLElement */
export let artWindow = null;
/** Data window, where the tabs and info window goes @type HTMLElement */
export let dataWindow = null;
/** Footer (bottom bar) element @type HTMLElement */
let btmBar = null;

export function BuildUI() {

    // top bar
    container = ui.CreateDivWithID('container');

    topBar = ui.AddElementWithClassTo(container, 'header');
    overlay = ui.AddElementWithClassTo(container, 'overlay');
    artWindow = ui.AddElementWithClassTo(container, 'artWindow');
    dataWindow = ui.AddElementWithClassTo(container, 'dataWindow');
    btmBar = ui.AddElementWithClassTo(container, 'footer');

    CreateHeaderFooter(topBar, btmBar);
    CreateDataWindow();
    CreateArtWindow();
    
    InitializeOverlay();

    if (_dataWindowOnTop) {
        ui.AddClassToDOMs('dataOnTop', container, artWindow, dataWindow);
    }
    if (_dataWindowOnLeft) {
        ui.AddClassToDOMs('dataOnLeft', container, artWindow, dataWindow);
    }

    document.body.appendChild(container);

    if (_useDemoBGColors) {
        ui.AddClassToDOMs('demoBG', topBar, btmBar, artWindow, dataWindow);
    }

}

export function DisplayUI() {
    // done, fade in content 
    dataWindow.style.opacity = 1;
}