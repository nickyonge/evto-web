/* EventListeners to ensure scrolling behaves, including on mobile */

/** CSS class denoting a scrollable element @type {string} */
const scrollableClass = '.scrollable';

/** Use passive events? Less performance-hungry, but may not work */
const passiveEvents = false;

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
    _initialized = true;
    return true;
}

/** Event listener for `'wheel'` */
function WheelScrollEvent() {
    // prevent overscroll 
    document.addEventListener('wheel', function (event) {
        let target = /** @type {HTMLElement} */ (event.target);
        const scrollable = target.closest(scrollableClass);
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
        event.preventDefault();

    }, {
        // addEventLsitener params 
        passive: passiveEvents,
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
        passive: passiveEvents
    });

    // track Y value movement 
    document.addEventListener('touchmove', function (event) {

        if (event.touches.length !== 1) return;

        let target = /** @type {HTMLElement} */ (event.target);

        const scrollable = target.closest(scrollableClass);
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
        event.preventDefault();

    }, {
        // addEventLsitener params 
        passive: passiveEvents,
        capture: true
    });
}
