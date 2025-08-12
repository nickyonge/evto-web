/* Main UI generation */

import { CreateHeaderFooter } from "./uiHdFt";
import { CreateDataWindow } from "./uiData";
import * as ui from './ui';

const _useDemoBGColors = false;

/** container div for all content on the page @type Element */
let container = null;

/** Header (top bar) element @type Element */
let topBar = null;
/** Art window, where the canvas rendering goes @type Element */
let artWindow = null;
/** Data window, where the tabs and info window goes @type Element */
export let dataWindow = null;
/** Footer (bottom bar) element @type Element */
let btmBar = null;

export function BuildUI() {

    // top bar
    container = ui.CreateDivWithID('container');

    topBar = ui.AddElementWithClassTo(container, 'header');
    artWindow = ui.AddElementWithClassTo(container, 'artWindow');
    dataWindow = ui.AddElementWithClassTo(container, 'dataWindow');
    btmBar = ui.AddElementWithClassTo(container, 'footer');

    CreateHeaderFooter(topBar, btmBar);
    CreateDataWindow();

    document.body.appendChild(container);

    if (_useDemoBGColors) {
        ui.AddClassToDOMs('demoBG', topBar, btmBar, artWindow, dataWindow);
    }

}