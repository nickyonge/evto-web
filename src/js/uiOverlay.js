import { DeselectElement, isBlank, LapCheckInterval, SelectFocusElement } from './lilutils';
import * as ui from './ui';
import { overlay } from './uiMain';

const allowOverlayBoxSelection = false;

let overlayBG;
let overlayBox;
let overlayTitleText;
let overlayBodyText;

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
        overlayTitleText = ui.CreateElementWithClass('p', 'overlayTitle');
        overlayBodyText = ui.CreateElementWithClass('p', 'overlayBody');
        overlay.appendChild(overlayBox);
        overlayBox.appendChild(overlayTitleText);
        overlayBox.appendChild(overlayBodyText);
        if (allowOverlayBoxSelection) {
            overlayBox.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        } else {
            ui.DisableContentSelection(overlayTitleText, overlayBodyText);
        }
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

export function ToggleOverlay(bodyText, titleText = null, sourceDiv = null) {
    InitializeOverlay();
    // determine show / hide 
    if (!IsOverlayDisplayed() || sourceDiv == null || sourceDiv != _sourceDiv) {
        // show overlay 
        _sourceDiv = sourceDiv;
        ShowOverlay(bodyText, titleText);
    } else {
        // hide overlay
        HideOverlay();
    }
}

function ShowOverlay(bodyText, titleText) {
    if (LapCheckInterval('overlay', _showInterval)) {
        DeselectElement(_sourceDiv);
        overlayTitleText.innerText = isBlank(titleText) ? '' : titleText;
        overlayBodyText.innerText = isBlank(bodyText) ? '' : bodyText;
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