/* Manager for tracking user input device */

/** Capture events bubbling up through the DOM tree? @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture @type {boolean} */
const USE_CAPTURE = true;

/** If `true`, removes all `move` event listeners the first time that {@linkcode TrackedPointerEvent} is called @type {boolean} */
const REMOVE_MOVE_EVENTS_ON_FIRST_EVENT = true;

/** If `true`, automatically calls {@linkcode InitializeInputManager()} as soon as this script is loaded */
const AUTO_INITIALIZE_ON_LOAD = false;

/** Has {@linkcode InitializeInputManager} been called? Should be called as soon as your page loads @type {boolean} */
let _initialized = false;
/** Has {@linkcode TrackedPointerEvent} been called yet? @type {boolean} */
let _firstEvent = false;

export const InputMode = Object.freeze({
    MOUSE: 'mouse',
    TOUCH: 'touch',
    PEN: 'pen',
});
export const PenAndTouchProtocol = Object.freeze({
    None: 'none',
    TouchIsPenOnly: 'touchIsPenOnly',
    PenIsTouchOnly: 'penIsTouchOnly',
    Equivalent: 'equivalent'
});

/** Local reference for the currentt {@linkcode InputMode} mode @type {inputMode} */
let currentMode = GetDefaultMode();

/** Initialize the {@linkcode window.InputMode} system */
export function InitializeInputManager() {
    if (_initialized) { return; }
    // set initial current mode 
    currentMode = window.InputMode.defaultMode;
    // tracked events for determining pointer activity
    if (window.PointerEvent) {
        // pointermove lets us detect input BEFORE the first click/tap
        window.addEventListener('pointermove', TrackedPointerEvent, USE_CAPTURE);
        window.addEventListener('pointerdown', TrackedPointerEvent, USE_CAPTURE);
    } else {
        // Fallback for old browsers: mouse/touch events
        window.addEventListener('mousemove', TrackedPointerEvent, USE_CAPTURE);
        window.addEventListener('mousedown', TrackedPointerEvent, USE_CAPTURE);
        window.addEventListener('touchmove', TrackedPointerEvent, USE_CAPTURE);
        window.addEventListener('touchstart', TrackedPointerEvent, USE_CAPTURE);
    }
    _initialized = true;
}

/**
 * Set to a specific {@linkcode InputMode}. 
 * 
 * If {@linkcode newMode} is different than {@linkcode currentMode}, triggers an 
 * {@linkcode window.InputMode.inputModeChange inputModeChange} event.
 * 
 * Returns `true` if an event was triggered. 
 * @param {inputMode} newMode Mode to change to 
 * @param {PointerEvent} sourceEvent `PointerEvent` that triggered the change 
 * @returns {boolean}
 */
function setMode(newMode, sourceEvent) {
    // nullcheck + do not trigger if new mode is the same 
    if (newMode == null || newMode === currentMode) { return false; }

    // update the mode 
    const previousMode = currentMode;
    currentMode = newMode;

    // if the input mode has changed, fire an event 
    const ev = new CustomEvent(window.InputMode.inputModeChange, {
        detail: {
            /** The {@linkcode InputMode} that was just changed to, now the current mode @type {inputMode} */
            currentMode: currentMode,
            /** The {@linkcode InputMode} that was changed from, the previous mode @type {inputMode} */
            previous: previousMode,
            /** The `PointerEvent` that triggered the change (may be null) @type {PointerEvent|null} */
            sourcePointerEvent: sourceEvent
        }
    });
    // dispatch the event 
    window.dispatchEvent(ev);
    return true;
}

/**
 * Determine the {@linkcode InputMode} based on a given pointer event 
 * @param {PointerEvent} pointerEvent 
 * @returns {inputMode}
 */
function InputModeFromEvent(pointerEvent) {
    // this has way too many failsafes lol 
    /** @type {string | number} */
    let pointerType = currentMode;
    if (pointerEvent == null) {
        console.warn("WARNING: Can't determine InputMode from null PointerEvent, basing off of currentMode or defaultMode, investigate", this);
    } else {
        if ('pointerType' in pointerEvent && pointerEvent.pointerType != null) {
            pointerType = /** @type {string|number} */ (pointerEvent.pointerType);
            if (pointerType == null) {
                console.warn("WARNING: null pointer type from event, can't determine updated pointer type, investigate", this);
            } else {
                if (typeof pointerType === 'string') {
                    switch (pointerType) {
                        case '2': // legacy numeric values 
                        case '3':
                        case '4':
                            pointerType = Number(pointerType);
                            break;
                        case '':
                            // unknown value, further inference is needed 
                            break;
                        case InputMode.MOUSE:
                        case InputMode.TOUCH:
                        case InputMode.PEN:
                            return pointerType;
                        default:
                            console.warn(`Invalid pointerType string ${pointerType}, can't easily determine pointer type, investigate`, this);
                            break;
                    }
                }
                // failsafe for old IE 10/11 legacy numeric values
                if (typeof pointerType === 'number') {
                    switch (pointerType) {
                        case 2:
                            return InputMode.TOUCH;
                        case 3:
                            return InputMode.PEN;
                        case 4:
                            return InputMode.MOUSE;
                    }
                }
            }
        }
        // failsafe, determine via event type 
        pointerType = pointerEvent.type?.trim();
        if (pointerType != null && pointerType.length > 0) {
            switch (pointerType) {
                case InputMode.TOUCH:
                case InputMode.PEN:
                case InputMode.MOUSE:
                    return pointerType;
            }
            // jeepers, maybe just check the first character?
            switch (pointerType[0].toLowerCase()) {
                case 'm': return InputMode.MOUSE;
                case 't': return InputMode.TOUCH;
                case 'p': return InputMode.PEN;
            }
        }
    } // - end pointerEvent nullcheck 
    if (pointerType == null) {
        console.warn(`PointerType could not be determined, defaulting to currentMode ${currentMode}, investigate`, this);
        if (currentMode == null) {
            pointerType = window.InputMode.defaultMode;
            console.warn(`Oh jeez, even currentMode is null, defaulting to window.InputMode.defaultMode: ${window.InputMode.defaultMode}`, this);
        } else {
            pointerType = currentMode;
        }
    }
    switch (pointerType) {
        case InputMode.TOUCH:
        case InputMode.PEN:
        case InputMode.MOUSE:
            return pointerType;
    }
    console.warn("Final failsafe pointertype return, if all else goes wrong, directly returning InputDevice.MOUSE", this);
    return InputMode.MOUSE;
}

/** 
 * Callback for tracked PointerEvent listeners 
 * @param {PointerEvent} pointerEvent 
 */
function TrackedPointerEvent(pointerEvent) {
    if (!_firstEvent) {
        _firstEvent = true;
        if (REMOVE_MOVE_EVENTS_ON_FIRST_EVENT) {
            window.addEventListener('pointermove', TrackedPointerEvent, USE_CAPTURE);
        }
    }
    const mode = InputModeFromEvent(pointerEvent);
    setMode(mode, pointerEvent);
}

/**
 * Returns whether or not a touchscreen is available on the 
 * user's device, returning `true` if so, or 'false' if not. 
 * 
 * Local implementation for {@linkcode window.InputMode.hasTouchscreen} 
 * 
 * @author Elvis Sedic  
 * {@link https://www.github.com/esedic github.com/esedic} 
 * 
 * Wrote the {@link https://gist.github.com/esedic/39a16a7521d42ae205203e3d40dc19f5 detect_touch.js} 
 * GitHub gist. This function uses that script's "Method 4" 
 * @returns {boolean}
 */
function HasTouchscreen() {
    let result = false;
    if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
        // if Pointer Events are supported, just check maxTouchPoints
        if (navigator.maxTouchPoints > 0) {
            result = true;
        }
    } else {
        // no Pointer Events...
        if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
            // check for any-pointer:coarse which mostly means touchscreen
            result = true;
        } else if (window.TouchEvent || ('ontouchstart' in window)) {
            // last resort - check for exposed touch events API / event handler
            result = true;
        }
    }
    return result;
}

/**
 * The default {@linkcode mode} used, based on the user's device capabilities. 
 * 
 * Local implementation for {@linkcode window.InputMode.defaultMode} 
 * 
 * If {@linkcode hasTouchscreen} is `true`, this will be 
 * {@linkcode InputMode.TOUCH}. If `false`, it will be {@linkcode InputMode.MOUSE} 
 * - **Note:** The default mode will never be {@linkcode InputMode.PEN}
 * @returns {inputMode}
 */
function GetDefaultMode() {
    return HasTouchscreen() ?
        InputMode.TOUCH :
        InputMode.MOUSE;
}

window.InputMode = {

    penAndTouchProtocol: PenAndTouchProtocol.PenIsTouchOnly,

    get mode() {
        if (this.forceMode != null) {
            return this.forceMode;
        }
        return currentMode;
    },

    get isMouse() { return currentMode === InputMode.MOUSE; },

    get isTouch() {
        switch (this.penAndTouchProtocol) {
            case PenAndTouchProtocol.None:
            case PenAndTouchProtocol.TouchIsPenOnly:
                return currentMode === InputMode.TOUCH;
            case PenAndTouchProtocol.PenIsTouchOnly:
            case PenAndTouchProtocol.Equivalent:
                return currentMode === InputMode.TOUCH || currentMode === InputMode.PEN;
        }
    },

    get isPen() {
        switch (this.penAndTouchProtocol) {
            case PenAndTouchProtocol.None:
            case PenAndTouchProtocol.PenIsTouchOnly:
                return currentMode === InputMode.PEN;
            case PenAndTouchProtocol.TouchIsPenOnly:
            case PenAndTouchProtocol.Equivalent:
                return currentMode === InputMode.PEN || currentMode === InputMode.TOUCH;
        }
    },

    inputModeChange: 'inputModeChange',

    defaultMode: GetDefaultMode(),

    get hasTouchscreen() { return HasTouchscreen(); },
};

if (AUTO_INITIALIZE_ON_LOAD) {
    InitializeInputManager();
}