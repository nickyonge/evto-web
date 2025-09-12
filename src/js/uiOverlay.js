import * as ui from './ui';
import { overlay } from './uiMain';

let overlayBG;
let overlayBox;

function Initialize() {
    if (!overlayBG) {
        overlayBG = ui.CreateDivWithClass('overlayBG');
        overlay.appendChild(overlayBG);
    }
    if (!overlayBox) {
        overlayBox = ui.CreateDivWithClass('overlayBox');
        overlay.appendChild(overlayBox);
    }
}

export function ShowOverlay(overlayText) {
    Initialize();
}