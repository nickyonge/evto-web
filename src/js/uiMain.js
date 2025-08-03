/* Main UI generation */

import { CreateHeaderFooter } from "./uiHdFt";
import * as ui from './ui';

const _useDemoBGColors = false;

/** container div for all content on the page @type Element */
let content = null;

let topBar = null;
let artWindow = null;
let dataWindow = null;
let btmBar = null;

export function BuildUI() {

    // top bar
    content = ui.CreateDivWithID('content');

    topBar = ui.AddElementTo(content, 'header');
    artWindow = ui.AddElementTo(content, 'artWindow');
    dataWindow = ui.AddElementTo(content, 'dataWindow');
    btmBar = ui.AddElementTo(content, 'footer');

    CreateHeaderFooter(topBar, btmBar);

    document.body.appendChild(content);

    if (_useDemoBGColors) {
        ui.AddClassToDOMs('demoBG', topBar, btmBar, artWindow, dataWindow);
    }

}