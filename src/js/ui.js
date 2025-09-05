/* Basic UI element generation */

import { isBlank } from "./lilutils";

// ------------------------------------------------------------------ 
// -----------------------------------  BASIC ELEMENT CREATION  ----- 
// ------------------------------------------------------------------ 

/**
 * Create a DIV HTMLElement
 * @returns {HTMLElement} newly made HTML <div> element
 */
export function CreateDiv() {
    return CreateElement('div');
}
/**
 * Create a DIV HTMLElement with the given ID
 * @param {string} id ID value
 * @returns {HTMLElement} newly made HTML <div> element
 */
export function CreateDivWithID(id) {
    let div = CreateDiv();
    div.id = id;
    return div;
}
/**
 * Create a DIV HTMLElement with the given CSS class(es)
 * @param {...string} cssClasses one or more CSS classes to add
 * @returns {HTMLElement} newly made HTML <div> element
 */
export function CreateDivWithClass(...cssClasses) {
    let div = CreateDiv();
    AddClassesToDOM(div, ...cssClasses);
    return div;
}
/**
 * Create a new HTMLElement of the given type
 * @param {string} newElement type of HTMLElement
 * @returns {HTMLElement} newly created HTMLElement
 */
export function CreateElement(newElement) {
    return document.createElement(newElement);
}
/**
 * Create a new HTMLElement of the given type, with one or more CSS classes
 * @param {string} newElement type of new HTMLElement
 * @param  {...string} cssClasses one or more classes to add to the new element
 * @returns {HTMLElement} returns HTMLElement with the given CSS class name(s)
 */
export function CreateElementWithClass(newElement, ...cssClasses) {
    let element = CreateElement(newElement);
    AddClassesToDOM(element, ...cssClasses);
    return element;
}
/**
 * Create a DIV HTMLElement with the given ID and CSS class(es)
 * @param {string} id ID value
 * @param {...string} cssClasses one or more CSS classes to add
 * @returns {HTMLElement} newly made HTML <div> element
 */
export function CreateDivWithIDAndClasses(id, ...cssClasses) {
    let div = CreateDiv();
    div.id = id;
    AddClassesToDOM(div, ...cssClasses);
    return div;
}
/**
 * Create an input `HTMLElement`, optionally with the given CSS class(es)
 * @param {string} type type of input, eg 'checkbox'
 * @param  {...string} cssClasses optional CSS class or classes to assign
 * @returns {HTMLElement} newly made HTML `<input>` element
 */
export function CreateInput(type, ...cssClasses) {
    let input = CreateElement('input');
    AddElementAttribute(input, 'type', type);
    AddClassesToDOM(input, ...cssClasses);
    return input;
}
/**
 * Create an input `HTMLElement` and the given ID, optionally with the given CSS class(es)
 * @param {string} type type of input, eg 'checkbox'
 * @param {string} id id for the input element
 * @param  {...string} cssClasses optional CSS class or classes to assign
 * @returns {HTMLElement} newly made HTML `<input>` element
 */
export function CreateInputWithID(type, id, ...cssClasses) {
    let input = CreateInput(type, ...cssClasses);
    AddElementAttribute(input, 'id', id);
    return input;
}
/**
 * Creates a new HTMLElement of the given type (newElement) 
 * and appends it as a child to the given pre-existing element (domElement)
 * @param {HTMLElement} domElement existing HTMLElement which will be newElement's parent
 * @param {string} newElement HTMLElement type to create and append as a child to domElement
 * @returns {HTMLElement} returns the newly created HTMLElement
 */
export function AddElementTo(domElement, newElement) {
    let element = CreateElement(newElement);
    domElement.appendChild(element);
    return element;
}

// ------------------------------------------------------------------ 
// -----------------------------------  CLASSES AND ATTRIBUTES  ----- 
// ------------------------------------------------------------------ 

/**
 * Creates a new HTMLElement of the given type (newElement) with the given CSS class(es)
 * and appends it as a child to the given pre-existing element (domElement)
 * @param {HTMLElement} domElement existing HTMLElement which will be newElement's parent
 * @param {string} newElement HTMLElement type to create and append as a child to domElement
 * @param  {...string} cssClasses one or more classes to add to the new element. 
 * If none is specified, uses `newElement` as class name
 * @returns {HTMLElement} returns the newly created HTMLElement
 */
export function AddElementWithClassTo(domElement, newElement, ...cssClasses) {
    if (cssClasses.length == 0) {
        cssClasses.push(newElement);
    }
    let element = CreateElementWithClass(newElement, ...cssClasses);
    domElement.appendChild(element);
    return element;
}

/**
 * Adds the given class(es) to the given HTMLElement (one element, multiple classes)
 * @param {HTMLElement} domElement HTMLElement to add the given classes to
 * @param  {...string} cssClasses one or more classes to add to the domElement
 * @returns 
 */
export function AddClassesToDOM(domElement, ...cssClasses) {
    if (cssClasses.length == 0) {
        return;
    }
    if (domElement.classList.length == 0) {
        domElement.classList.add(...cssClasses);
        return;
    }
    for (let i = 0; i < cssClasses.length; i++) {
        if (!domElement.classList.contains(cssClasses[i])) {
            domElement.classList.add(cssClasses[i]);
        }
    }
}
/**
 * Adds the given class to the given HTMLElement(s) (one class, multiple elements)
 * @param {string} cssClass Class to add
 * @param  {...Element} domElements HTMLElement(s) to add the class to
 */
export function AddClassToDOMs(cssClass, ...domElements) {
    for (let i = 0; i < domElements.length; i++) {
        if (!domElements[i].classList.contains(cssClass)) {
            domElements[i].classList.add(cssClass);
        }
    }
}

/**
 * Removes the given class(es) from the given HTMLElement (one element, multiple classes)
 * @param {HTMLElement} domElement HTMLElement to remove the given classes from
 * @param  {...string} cssClasses one or more classes to remove from the domElement
 * @returns 
 */
export function RemoveClassesFromDOM(domElement, ...cssClasses) {
    if (domElement.classList.length == 0) {
        return;
    }
    for (let i = 0; i < cssClasses.length; i++) {
        if (domElement.classList.contains(cssClasses[i])) {
            domElement.classList.remove(cssClasses[i]);
        }
    }
}
/**
 * Removes the given class from the given HTMLElement(s) (one class, multiple elements)
 * @param {string} cssClass Class to remove
 * @param  {...Element} domElements HTMLElement(s) to remove the class from
 */
export function RemoveClassFromDOMs(cssClass, ...domElements) {
    for (let i = 0; i < domElements.length; i++) {
        if (domElements[i].classList.contains(cssClass)) {
            domElements[i].classList.remove(cssClass);
        }
    }
}

/**
 * Sets the given attributes on the given HTMLElement (attTypes and attValues lengths must match)
 * @param {HTMLElement} element HTMLElement to add attributes to
 * @param {string[]} attTypes Array of attribute types (qualifiedNames)
 * @param {string[]} attValues Array of values of attributes
 */
export function AddElementAttributes(element, attTypes, attValues) {
    if (attTypes.length != attValues.length) {
        console.error("ERROR: attribute types and values array lengths must match");
        return;
    }
    for (let i = 0; i < attTypes.length; i++) {
        AddElementAttribute(element, attTypes[i], attValues[i]);
    }
}

/**
 * Sets the given attribute on the given HTMLElement
 * @param {HTMLElement} element HTMLElement to add attribute to
 * @param {string} attTypes Type (qualifiedName) of attribute
 * @param {string} attValues Value of attributue
 */
export function AddElementAttribute(element, attType, attValue) {
    element.setAttribute(attType, attValue);
}

// ------------------------------------------------------------------- 
// --------------------------------------  OTHER BASIC ELEMENTS  ----- 
// ------------------------------------------------------------------- 


/**
 * Creates a new `<img>` element, and assigns the given src attribute (and optional alt text value)
 * @param {string} imgSrc Value to add to the "src" attribute to the new img
 * @param {string} alt Alt text to provide to the new img (optional)
 * @returns 
 */
export function CreateImage(imgSrc, alt) {
    let img = CreateElement('img');
    img.setAttribute('src', imgSrc);
    if (!isBlank(alt)) {
        img.setAttribute('alt', alt);
    }
    return img;
}

// ------------------------------------------------------------------ 
// ---------------------------------  NAVIGATION AND SELECTION  ----- 
// ------------------------------------------------------------------ 

/**
 * Make the given HTMLElement appear in the tab index for the page
 * Note: giving the `tabIndex` value `-1` will make an element untabbable, even if it's tabbable by default.
 * @param {HTMLElement} element HTMLElement to add to the tab index 
 * @param {number} [tabIndex=0] Optional value to specify tab index. `-1` = not tabbable
 * @param {boolean} [preserve=true] Optionally add a `preservedTabIndex` attribute with the given `tabIndex` value
 */
export function MakeTabbable(element, tabIndex = 0, preserve = true) {
    element.setAttribute('tabIndex', tabIndex);
    if (preserve) {
        element.setAttribute('preservedTabIndex', tabIndex);
    }
}

/**
 * Makes the given HTMLElement appear in the tab index for the page, 
 * and sends any received keyboard enter/spacebar inputs to `inputToElement`.
 * Eg, if you add a <label> to the tab index, but want to send its input to a different <input> tag.
 * @param {HTMLElement} tabElement HTMLElement to add to the tab index
 * @param {HTMLElement} inputToElement HTMLElement that receives Enter/Spacebar keyboard input from `tabElement` as a `click()`
 * @param {number} tabIndex Default 0, optional value to specify tab index. `-1` = not tabbable (and no input events are added)
 */
export function MakeTabbableWithInputTo(tabElement, inputToElement, tabIndex = 0) {
    MakeTabbable(tabElement, tabIndex);
    if (tabIndex != -1) {
        PassKeyboardSelection(tabElement, inputToElement);
    }
}

/**
 * Adds a `keydown` event listener for Enter/Spacebar to `fromElement`, which sends a `click()` event to the `toElement`
 * @param {HTMLElement} fromElement Element that receives the user keyboard input
 * @param {HTMLElement} toElement Element that the `click()` event gets sent to
 */
export function PassKeyboardSelection(fromElement, toElement) {
    fromElement.addEventListener('keydown', e => {
        // much older devices check for "Spacebar", might as well support it 
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
            e.preventDefault(); // don't scroll the page down or anything
            toElement.click(); // pass click to new element
        }
    });
}

/** Disable text/content selection overall
 * @param  {...HTMLElement} domElements Elements to assign these selection parameters to */
export function DisableContentSelection(...domElements) {
    RemoveClassFromDOMs('allowSelectDefaultCursor', ...domElements); // prevent conflicts
    AddClassToDOMs('preventSelect', ...domElements); // prevent selection 
}
/** Allow text/content selection but keep the default, non-text cursor
 * @param  {...HTMLElement} domElements Elements to assign these selection parameters to */
export function AllowContentSelectionWithDefaultCursor(...domElements) {
    RemoveClassFromDOMs('preventSelect', ...domElements); // prevent conflicts
    AddClassToDOMs('allowSelectDefaultCursor', ...domElements); // allow selection, default cursor
}
/** Allow text/content selection, keep regular cursor properties (text selection carat)
 * @param  {...HTMLElement} domElements Elements to assign these selection parameters to */
export function AllowContentSelectionWithTextIndicator(...domElements) {
    RemoveClassFromDOMs('allowSelectDefaultCursor', ...domElements);
    RemoveClassFromDOMs('preventSelect', ...domElements); // default selection type
}

// TODO: add enter input to elements that only function on spacebar (eg, rn the "Subscribe" btn works for Spacebar but not Enter)
// TODO: add keyboard input to social media buttons (they don't respond in CSS to keyboard at all)