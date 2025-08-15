/* UI elements for the Data window - canvas view, info, etc */

import { artWindow } from "./uiMain";
import * as ui from './ui';

let canvasContainer;
let infoContainer;

export function CreateArtWindow() {
    // create containers 
    canvasContainer = ui.CreateDivWithClass('artWindow','canvas');
    infoContainer = ui.CreateDivWithClass('info');
    // add to artWindow
    artWindow.appendChild(canvasContainer);
    artWindow.appendChild(infoContainer);
}