import { DeselectElement, IsActiveElement } from './lilutils';
import * as ui from './ui';
import { overlay } from './uiMain';

let overlayBG;
let overlayBox;

let _sourceDiv;

export function InitializeOverlay() {
    if (!overlayBG) {
        overlayBG = ui.CreateDivWithClass('overlayBG');
        ui.AddElementAttribute(overlayBG, 'show', 'false');
        overlay.appendChild(overlayBG);
        overlay.addEventListener('click', SelectOverlay);
    }
    if (!overlayBox) {
        overlayBox = ui.CreateDivWithClass('overlayBox');
        ui.AddElementAttribute(overlayBox, 'show', 'false');
        overlay.appendChild(overlayBox);
    }
}

function SelectOverlay() {
    InitializeOverlay();
    if (IsOverlayDisplayed()) {
        SetOverlayShow(false);
    }
}

export function ToggleOverlay(overlayText, sourceDiv = null) {
    InitializeOverlay();
    // determine show / hide 
    if (!IsOverlayDisplayed() || sourceDiv == null || sourceDiv != _sourceDiv) {
        // show overlay 
        SetOverlayShow(true);
        _sourceDiv = sourceDiv;
    } else {
        // hide overlay
        _sourceDiv = sourceDiv;
        SetOverlayShow(false);
    }
}

function SetOverlayShow(set) {
    ui.AddElementAttribute(overlayBG, 'show', `${set}`);
    ui.AddElementAttribute(overlayBox, 'show', `${set}`);
    ui.AddElementAttribute(overlayBox, 'show', `${set}`);
}

function IsOverlayDisplayed() {
    return ui.GetAttribute(overlayBG, 'show') == 'true';
}