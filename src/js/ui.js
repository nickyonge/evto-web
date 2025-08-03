/* Basic UI element generation */

import { isBlank } from "./lilutils";

export function CreateDiv() {
    return document.createElement('div'); 
}
export function CreateDivWithID(id) {
    let div = CreateDiv();
    div.id = id;
    return div;
}
export function AddElementTo(domElement, newElement) {
    let element = CreateElement(newElement);
    domElement.appendChild(element);
    return element;
}
export function CreateElement(newElement) {
    return document.createElement(newElement);
}
export function CreateElementWithClass(newElement, ...cssClasses) {
    let element = CreateElement(newElement);
    element.classList.add(...cssClasses);
    return element;
}
export function CreateDivWithIDAndClasses(id, ...cssClasses) {
    let div = CreateDiv();
    div.id = id;
    div.classList.add(...cssClasses);
    return div;
}
export function CreateDivWithClass(...cssClasses) {
    let div = CreateDiv();
    div.classList.add(...cssClasses);
    return div;
}

export function AddClassesToDOM(domElement, ...cssClasses) {
    domElement.classList.add(...cssClasses);
}
export function AddClassToDOMs(cssClass, ...domElements) {
    for (let i = 0; i < domElements.length; i++) {
        if (!domElements[i].classList.contains(cssClass)) {
            domElements[i].classList.add(cssClass);
        }
    }
}

export function CreateImage(imgSrc, alt) {
    let img = CreateElement('img');
    img.setAttribute('src', imgSrc);
    if (!isBlank(alt)) {
        img.setAttribute('alt', alt);
    }
    return img;
}