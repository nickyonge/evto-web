
const _useDemoBGColors = false;

let content = null;
let topBar = null;
let artWindow = null;
let dataWindow = null;
let btmBar = null;

export function BuildUI() {

    // top bar

    content = CreateDivWithID('content');
    topBar = AddElementTo(content, 'header');
    artWindow = AddElementTo(content, 'artWindow');
    dataWindow = AddElementTo(content, 'dataWindow');
    btmBar = AddElementTo(content, 'footer');

    CreateTopBar();

    // content = CreateDivWithClass('content');
    // topBar = CreateDivWithClass('topBar');
    // btmBar = CreateDivWithClass('btmBar');

    // document.body.appendChild(content);
    // document.body.appendChild(topBar);
    // document.body.appendChild(btmBar);

    // artWindow = CreateDivWithClass('content', 'window', 'art');
    // dataWindow = CreateDivWithClass('content', 'window', 'data');

    // content.appendChild(artWindow);
    // content.appendChild(dataWindow);

    document.body.appendChild(content);

    if (_useDemoBGColors) {
        AddClassToDOMs('demoBG', topBar, btmBar, artWindow, dataWindow);
    }

}


/* Unique UI element generation */

function CreateTopBar() {
    let titleContainer = CreateDivWithClass('title');
    let subtitle = AddElementTo(titleContainer, 'h3');
    let title = AddElementTo(titleContainer, 'h1');
    subtitle.innerText = "Everywhere Together";
    title.innerText = "Canvas Visualizer"
    topBar.appendChild(titleContainer);
    topBar.appendChild(CreateHamburgerButton());
}

function CreateHamburgerButton() {
    let btn = document.createElement('label');
    btn.setAttribute('class', 'burger');
    btn.setAttribute('for', 'burger');
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', 'burger');
    btn.appendChild(input);
    btn.appendChild(document.createElement('span'));
    btn.appendChild(document.createElement('span'));
    btn.appendChild(document.createElement('span'));
    return btn;
}


/* Basic UI element generation */

function CreateDiv() {
    return document.createElement('div');
}
function CreateDivWithID(id) {
    let div = CreateDiv();
    div.id = id;
    return div;
}
function AddElementTo(domElement, newElement) {
    let element = document.createElement(newElement);
    domElement.appendChild(element);
    return element;
}
function CreateDivWithIDAndClasses(id, ...cssClasses) {
    let div = CreateDiv();
    div.id = id;
    div.classList.add(...cssClasses);
    return div;
}
function CreateDivWithClass(...cssClasses) {
    let div = CreateDiv();
    div.classList.add(...cssClasses);
    return div;
}

function AddClassesToDOM(domElement, ...cssClasses) {
    domElement.classList.add(...cssClasses);
}
function AddClassToDOMs(cssClass, ...domElements) {
    for (let i = 0; i < domElements.length; i++) {
        if (!domElements[i].classList.contains(cssClass)) {
            domElements[i].classList.add(cssClass);
        }
    }
}