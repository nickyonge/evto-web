/* functionality related to the Art window */

import * as ui from './ui';
import { canvasInner } from './uiArt';

let _initialized = false;

export function SetupArtWindow() {
    if (_initialized) { return; }

    _initialized = true;
}

/** Gets the *width* of the {@linkcode canvasInner} UI element */
function canvasWidth() { if (!_initialized) { return 0; } return canvasInner.offsetWidth; }
/** Gets the *height* of the {@linkcode canvasInner} UI element */
function canvasHeight() { if (!_initialized) { return 0; } return canvasInner.offsetHeight; }
/** Gets the *aspect ratio*, or width / height, of the {@linkcode canvasInner} UI element */
function canvasAspect() {
    if (!_initialized) { return 0; }
    let height = canvasHeight();
    return height == 0 ? 0 : canvasWidth() / canvasHeight();
}
