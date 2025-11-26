/* EventListeners to ensure scrolling behaves, including on mobile */

import { CallOnLoadComplete } from '.';
import { GetAllElementsWithClass } from './lilutils';
import { disableBodyScroll } from 'body-scroll-lock';

/** CSS class denoting a scrollable element @type {string} */
const SCROLLABLE_CLASS = '.scrollable';

/** Use passive events? Less performance-hungry, but may not work */
const USE_PASSIVE_EVENTS = false;

/** 
 * Replaces scrollbar width with gap to prevent flickering
 * @see https://github.com/willmcpo/body-scroll-lock?tab=readme-ov-file#reservescrollbargap
 */
const BODYSCROLL_ASSIGN_RESERVE_SCROLL_BAR_GAP = false;
const BODYSCROLL_SET_RESERVE_SCROLL_BAR_GAP_TO = true;

/** local flag to track whether or not this system is initialized @type {boolean} */
let _initialized = false;

/** tracks the last Y value of the last `touchstart` event @type {number} */
let lastTouchY = 0;

/**
 * Initialize document scroll event listeners.  
 * Returns `false` if already initialized
 * @returns {boolean} 
 */
export function InitializeScrollEvents() {
    if (_initialized) { return false; }
    WheelScrollEvent();
    TouchScrollEvent();
    CallOnLoadComplete(OnDocLoadedCallback);
    _initialized = true;
    return true;
}

function OnDocLoadedCallback() {
    // ensure the given elements are allowed to scroll 
    GetAllElementsWithClass(SCROLLABLE_CLASS).forEach(scrollElement => {
        disableBodyScroll(scrollElement,
            {
                reserveScrollBarGap: BODYSCROLL_ASSIGN_RESERVE_SCROLL_BAR_GAP ?
                    BODYSCROLL_SET_RESERVE_SCROLL_BAR_GAP_TO : undefined
            });
    });
}

/** Event listener for `'wheel'` */
function WheelScrollEvent() {
    // prevent overscroll 
    document.addEventListener('wheel', function (event) {
        let target = /** @type {HTMLElement} */ (event.target);
        const scrollable = target.closest(SCROLLABLE_CLASS);
        // if we're NOT in a scrollable element, block the scroll (no page scroll/overscroll)
        if (!scrollable) {
            event.preventDefault();
            return;
        }
        // determine destination + directional scroll ability 
        const deltaY = event.deltaY;
        const goingDown = deltaY > 0;
        const goingUp = deltaY < 0;

        const scrollTop = scrollable.scrollTop;
        const scrollHeight = scrollable.scrollHeight;
        const clientHeight = scrollable.clientHeight;

        const atTop = scrollTop === 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight;

        // allow in-scrollable-element scrolling to proceed 
        if ((goingUp && !atTop) || (goingDown && !atBottom)) {
            return; // allow normal scrolling *inside* the element
        }

        // not inside a non-scrollable element, carry on with overscroll interruption 
        if (event.cancelable) {
            event.preventDefault();
        }

    }, {
        // addEventLsitener params 
        passive: USE_PASSIVE_EVENTS,
        capture: true
    });
}


/** Event listener for `'wheel'` */
function TouchScrollEvent() {

    // track the Y height start of touch events
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length === 1) {
            lastTouchY = event.touches[0].clientY;
        }
    }, {
        passive: USE_PASSIVE_EVENTS
    });

    // track Y value movement 
    document.addEventListener('touchmove', function (event) {

        if (event.touches.length !== 1) return;

        let target = /** @type {HTMLElement} */ (event.target);

        const scrollable = target.closest(SCROLLABLE_CLASS);
        // if we're NOT in a scrollable element, block the scroll (no page scroll/overscroll)
        if (!scrollable) {
            event.preventDefault();
            return;
        }

        const touchY = event.touches[0].clientY;// dw about multitouch 
        const deltaY = lastTouchY - touchY; // positive is down
        lastTouchY = touchY;

        // determine destination + directional scroll ability 
        const goingDown = deltaY > 0;
        const goingUp = deltaY < 0;

        const scrollTop = scrollable.scrollTop;
        const scrollHeight = scrollable.scrollHeight;
        const clientHeight = scrollable.clientHeight;

        const atTop = scrollTop === 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight;

        // allow in-scrollable-element scrolling to proceed 
        if ((goingUp && !atTop) || (goingDown && !atBottom)) {
            return; // allow normal scrolling *inside* the element
        }

        // not inside a non-scrollable element, carry on with overscroll interruption 
        if (event.cancelable) {
            event.preventDefault();
        }

    }, {
        // addEventLsitener params 
        passive: USE_PASSIVE_EVENTS,
        capture: true
    });
}
