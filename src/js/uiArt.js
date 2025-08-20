/* UI elements for the Data window - canvas view, info, etc */

import { artWindow } from "./uiMain";
import * as ui from './ui';

let canvasContainer;
let canvasInner;

let infoContainer;
let infoInner;

export function CreateArtWindow() {
    // create canvas window 
    canvasContainer = ui.CreateDivWithClass('canvas');
    canvasInner = ui.CreateDivWithClass('inner');
    canvasContainer.appendChild(canvasInner);
    // create info window 
    infoContainer = ui.CreateDivWithClass('info');
    infoInner = ui.CreateDivWithClass('inner');
    infoContainer.appendChild(infoInner);
    // add to artWindow
    artWindow.appendChild(canvasContainer);
    artWindow.appendChild(infoContainer);
}