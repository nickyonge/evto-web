/* EventListener to ensure scrolling behaves, including on mobile */

const scrollableClass = '.scrollable';

let _initialized = false;

/**
 * Initialize document scroll event listener
 * @returns {boolean}
 */
export function InitializeScrollEvents() {
    if (_initialized) { return; }
    _initialized = true;
    
    // prevent overscroll 
    document.addEventListener('wheel', function (event) {
        let target = /** @type {HTMLElement} */ (event.target);
        const scrollable = target.closest('.scrollable');
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
        passive: false,
        capture: true
    });
}
