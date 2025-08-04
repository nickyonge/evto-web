/* Basic UI element generation */

import { isBlank } from "./lilutils";

/**
 * Create a DIV element
 * @returns {Element} newly made HTML <div> element
 */
export function CreateDiv() {
    return CreateElement('div'); 
}
/**
 * Create a DIV element with the given ID
 * @param {string} id ID value
 * @returns {Element} newly made HTML <div> element
 */
export function CreateDivWithID(id) {
    let div = CreateDiv();
    div.id = id;
    return div;
}
/**
 * Create a DIV element with the given CSS class(es)
 * @param {...string} cssClasses one or more CSS classes to add
 * @returns {Element} newly made HTML <div> element
 */
export function CreateDivWithClass(...cssClasses) {
    let div = CreateDiv();
    div.classList.add(...cssClasses);
    return div;
}
/**
 * Create a DIV element with the given ID and CSS class(es)
 * @param {string} id ID value
 * @param {...string} cssClasses one or more CSS classes to add
 * @returns {Element} newly made HTML <div> element
 */
export function CreateDivWithIDAndClasses(id, ...cssClasses) {
    let div = CreateDiv();
    div.id = id;
    div.classList.add(...cssClasses);
    return div;
}
/**
 * Creates a new element of the given type (newElement) 
 * and appends it as a child to the given pre-existing element (domElement)
 * @param {Element} domElement existing element which will be newElement's parent
 * @param {string} newElement element type to create and append as a child to domElement
 * @returns {Element} returns the newly created element
 */
export function AddElementTo(domElement, newElement) {
    let element = CreateElement(newElement);
    domElement.appendChild(element);
    return element;
}
/**
 * Create a new element of the given type
 * @param {string} newElement type of element
 * @returns {Element}
 */
export function CreateElement(newElement) {
    return document.createElement(newElement);
}
/**
 * Create a new element of the given type, with one or more CSS classes
 * @param {string} newElement 
 * @param  {...string} cssClasses 
 * @returns {Element} returns element with the given CSS class name(s)
 */
export function CreateElementWithClass(newElement, ...cssClasses) {
    let element = CreateElement(newElement);
    element.classList.add(...cssClasses);
    return element;
}

/**
 * Adds the given class(es) to the given DOM element (one element, multiple classes)
 * @param {Element} domElement DOM element to add the given classes to
 * @param  {...string} cssClasses one or more classes to add to the domElement
 * @returns 
 */
export function AddClassesToDOM(domElement, ...cssClasses) {
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
 * Adds the given class to the given DOM element(s) (one class, multiple elements)
 * @param {string} cssClass Class to add
 * @param  {...Element} domElements DOM Element(s) to add the class to
 */
export function AddClassToDOMs(cssClass, ...domElements) {
    for (let i = 0; i < domElements.length; i++) {
        if (!domElements[i].classList.contains(cssClass)) {
            domElements[i].classList.add(cssClass);
        }
    }
}

/**
 * Sets the given attributes on the given element (attTypes and attValues lengths must match)
 * @param {Element} element Element to add attributes to
 * @param {string[]} attTypes Array of attribute types (qualifiedNames)
 * @param {string[]} attValues Array of values of attributes
 */
export function AddElementAttributes(element, attTypes, attValues) {
    if (attTypes.length != attValues.length) {
        console.error("ERROR: attribute types and values array lengths must match");
        return;
    }
    for (let i = 0; i < attTypes; i++) {
        AddElementAttribute(element, attTypes[i], attValues[i]);
    }
}

/**
 * Sets the given attribute on the given element
 * @param {Element} element Element to add attribute to
 * @param {string} attTypes Type (qualifiedName) of attribute
 * @param {string} attValues Value of attributue
 */
export function AddElementAttribute(element, attType, attValue) {
    element.setAttribute(attType, attValue);
}

/**
 * Creates a new <img> element, and assigns the given src attribute (and optional alt text value)
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