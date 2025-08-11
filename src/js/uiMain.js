/* Main UI generation */

import { CreateHeaderFooter } from "./uiHdFt";
import { CreateDataWindow } from "./uiData";
import * as ui from './ui';

const _useDemoBGColors = false;

/** container div for all content on the page @type Element */
let content = null;

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
    content = ui.CreateDivWithID('content');

    topBar = ui.AddElementWithClassTo(content, 'header');
    artWindow = ui.AddElementWithClassTo(content, 'artWindow');
    dataWindow = ui.AddElementWithClassTo(content, 'dataWindow');
    btmBar = ui.AddElementWithClassTo(content, 'footer');

    CreateHeaderFooter(topBar, btmBar);
    CreateDataWindow(dataWindow);

    document.body.appendChild(content);

    if (_useDemoBGColors) {
        ui.AddClassToDOMs('demoBG', topBar, btmBar, artWindow, dataWindow);
    }

}