import { DeselectElement, LapCheckInterval, SelectFocusElement } from './lilutils';
import * as ui from './ui';
import { overlay } from './uiMain';

let overlayBG;
let overlayBox;

let _sourceDiv;
let _initialized = false;

const _showInterval = 50;

export function InitializeOverlay() {
    if (_initialized) { return; }
    if (!overlayBG) {
        overlayBG = ui.CreateDivWithClass('overlayBG');
        ui.AddElementAttribute(overlayBG, 'show', 'false');
        overlay.appendChild(overlayBG);
        overlay.addEventListener('click', () => {
            if (IsOverlayDisplayed()) {
                HideOverlay();
            }
        });
    }
    if (!overlayBox) {
        overlayBox = ui.CreateDivWithClass('overlayBox');
        ui.AddElementAttribute(overlayBox, 'show', 'false');
        overlay.appendChild(overlayBox);
    }
    // keydown event
    document.addEventListener('keydown', (e) => {
        // TODO: key repeat is blocked when enabling overlay, but not on disabling (it will reopen)
        if (e.repeat) { return; }
        if (IsOverlayDisplayed()) {
            HideOverlay();
        }
    })
    _initialized = true;
}

export function ToggleOverlay(overlayText, sourceDiv = null) {
    InitializeOverlay();
    // determine show / hide 
    if (!IsOverlayDisplayed() || sourceDiv == null || sourceDiv != _sourceDiv) {
        // show overlay 
        _sourceDiv = sourceDiv;
        ShowOverlay();
    } else {
        // hide overlay
        HideOverlay();
    }
}

function ShowOverlay() {
    if (LapCheckInterval('overlay', _showInterval)) {
        DeselectElement(_sourceDiv);
        SetOverlayShow(true);
    }
}
function HideOverlay() {
    if (LapCheckInterval('overlay', _showInterval)) {
        SetOverlayShow(false);
        SelectFocusElement(_sourceDiv, false);
    }
}

function SetOverlayShow(set) {
    ui.AddElementAttribute(overlayBG, 'show', `${set}`);
    ui.AddElementAttribute(overlayBox, 'show', `${set}`);
}

function IsOverlayDisplayed() {
    return ui.GetAttribute(overlayBG, 'show') == 'true';
}