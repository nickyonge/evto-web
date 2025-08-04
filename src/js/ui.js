/* Basic UI element generation */

import { isBlank } from "./lilutils";

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
    div.classList.add(...cssClasses);
    return div;
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
    div.classList.add(...cssClasses);
    return div;
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
    element.classList.add(...cssClasses);
    return element;
}

/**
 * Adds the given class(es) to the given HTMLElement (one element, multiple classes)
 * @param {HTMLElement} domElement HTMLElement to add the given classes to
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