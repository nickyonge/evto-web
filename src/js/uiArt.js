/* UI elements for the Data window - canvas view, info, etc */

import { artWindow } from "./uiMain";
import * as ui from './ui';
import * as txt from './text';

let canvasContainer;
let canvasInner;

let infoContainer;
let infoTitle;
let infoInner;

export function CreateArtWindow() {
    // create canvas window 
    canvasContainer = ui.CreateDivWithClass('canvas');
    canvasInner = ui.CreateDivWithClass('inner');
    canvasContainer.appendChild(canvasInner);
    // create info window 
    infoContainer = ui.CreateDivWithClass('info');
    infoTitle = ui.CreateDivWithClass('title');
    infoInner = ui.CreateDivWithClass('inner');
    infoTitle.innerHTML = `<h3>${txt.INFO_TITLE}</h3>`;
    ui.AllowContentSelectionWithDefaultCursor(infoTitle);
    infoContainer.appendChild(infoInner);
    infoInner.appendChild(infoTitle);
    // add to artWindow
    artWindow.appendChild(canvasContainer);
    artWindow.appendChild(infoContainer);
}