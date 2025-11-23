import { DeselectElement, isBlank, LapCheckInterval, SelectFocusElement } from './lilutils';
import * as ui from './ui';
import { overlay } from './uiMain';

const allowOverlayBoxSelection = false;
const allowOverlayTextSelection = true && allowOverlayBoxSelection;

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
        SetOverlayShow(false, 'bg');
        overlay.appendChild(overlayBG);
        overlay.addEventListener('click', () => {
            if (IsOverlayDisplayed()) {
                HideOverlay();
            }
        });
    }
    if (!overlayBox) {
        overlayBox = ui.CreateDivWithClass('overlayBox');
        overlayTitleText = ui.CreateElementWithClass('p', 'overlayTitle');
        overlayBodyText = ui.CreateElementWithClass('p', 'overlayBody');
        SetOverlayShow(false, 'box');
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
        // TODO: key repeat is blocked when enabling overlay, but not on disabling (eg, help will reopen on close)
        // Issue URL: https://github.com/nickyonge/evto-web/issues/18
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

function SetOverlayShow(set, target = 'both') {
    function SetTargetShow(set, target, alsoSetSelectable = true) {
        ui.AddElementAttribute(target, 'show', `${set}`);
        SetTargetSelectable(set && alsoSetSelectable, target);
    }
    function SetTargetSelectable(set, target) {
        if (set) {
            ui.AddClassToDOMs('selectable', target);
        } else {
            ui.RemoveClassFromDOMs('selectable', target);
        }
    }
    switch (target) {
        case 'box':
            SetTargetShow(set, overlayBox, allowOverlayBoxSelection);
            SetTargetSelectable(set && allowOverlayTextSelection, overlayBodyText);
            SetTargetSelectable(set && allowOverlayTextSelection, overlayTitleText);
            break;
        case 'bg':
            SetTargetShow(set, overlayBG);
            break;
        case 'both':
        default:
            SetOverlayShow(set, 'box');
            SetOverlayShow(set, 'bg');
            break;
    }
}
function IsOverlayDisplayed(target = 'bg') {
    function IsTargetDisplayed(target) {
        return ui.GetAttribute(target, 'show') == 'true';
    }
    switch (target) {
        case 'box':
            return IsTargetDisplayed(overlayBox);
        case 'bg':
            return IsTargetDisplayed(overlayBG);
        case 'either':
        default:
            return IsOverlayDisplayed('box') || IsOverlayDisplayed('bg');
    }
}