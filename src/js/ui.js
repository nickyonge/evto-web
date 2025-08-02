import svgGithub from '../assets/svg/github.svg';
import svgInstagram from '../assets/svg/instagram.svg';
import svgBluesky from '../assets/svg/bluesky.svg';

const _useDemoBGColors = false;

let content = null;
let topBar = null;
let artWindow = null;
let dataWindow = null;
let btmBar = null;

const _placeholderEmailText = "Duck Pond Newsletter";
const _slidingButtonText = "Live now on Kickstarter!";

/**
 * check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @returns true if blank, false if contains content
 */
const isBlank = str => !str || !str.trim();


export function BuildUI() {

    // top bar
    console.log("WPP: " + __webpack_public_path__);
    content = CreateDivWithID('content');
    topBar = AddElementTo(content, 'header');
    artWindow = AddElementTo(content, 'artWindow');
    dataWindow = AddElementTo(content, 'dataWindow');
    btmBar = AddElementTo(content, 'footer');

    CreateTopBar();
    CreateBottomBar();

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
    let titleContainer = CreateDivWithClass('title', 'preventSelect');
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


function CreateBottomBar() {
    // ------------------------------ create social buttons 
    let ul = CreateElementWithClass('ul', 'sbWrapper');
    ul.appendChild(CreateSocialButton('GitHub'));
    ul.appendChild(CreateSocialButton('Instagram'));
    ul.appendChild(CreateSocialButton('Bluesky'));
    btmBar.appendChild(ul);
    // ------------------------------ create mailing list join 
    let mailGroup = CreateDivWithClass('minput-group');
    let mailInput = CreateElementWithClass('input', 'minput');
    mailInput.setAttribute('id', 'Email');
    mailInput.setAttribute('name', 'Email');
    mailInput.setAttribute('placeholder', _placeholderEmailText);
    mailInput.setAttribute('autocomplete', 'off');
    let mailButton = CreateElementWithClass('input', 'mbuttonSubmit');
    mailButton.setAttribute('value', 'Subscribe');
    mailButton.setAttribute('type', 'submit');
    mailGroup.appendChild(mailInput);
    mailGroup.appendChild(mailButton);
    btmBar.appendChild(mailGroup);
    // create sliding button
    btmBar.appendChild(CreateSlidingButton());
}
function CreateSocialButton(name) {
    let li = CreateElementWithClass('li', 'icon', name.toLowerCase(), 'preventSelect');
    let tt = CreateElementWithClass('span', 'tooltip');
    tt.innerText = name;
    li.appendChild(tt);
    let img = CreateImage(GetImgByName(name), name);
    li.appendChild(img);
    return li;
}

function GetImgByName(name) {
    switch (name.toLowerCase()) {
        case "github":
            return svgGithub;
        case "instagram":
            return svgInstagram;
        case "bluesky":
            return svgBluesky;
    }
    console.warn("Could not GetImgByName from name: " + name);
    return null;
}

function CreateSlidingButton() {
    let btn = CreateElementWithClass('button', 'slidingbtn');
    let circle = CreateElementWithClass('span', 'circle');
    circle.setAttribute('aria-hidden', 'true');
    circle.appendChild(CreateElementWithClass('span', 'icon', 'arrow'));
    btn.appendChild(circle);
    let text = CreateElementWithClass('span', 'button-text', 'preventSelect');
    text.innerText = _slidingButtonText;
    btn.appendChild(text);
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
    let element = CreateElement(newElement);
    domElement.appendChild(element);
    return element;
}
function CreateElement(newElement) {
    return document.createElement(newElement);
}
function CreateElementWithClass(newElement, ...cssClasses) {
    let element = CreateElement(newElement);
    element.classList.add(...cssClasses);
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

function CreateImage(imgSrc, alt) {
    let img = CreateElement('img');
    img.setAttribute('src', imgSrc);
    if (!isBlank(alt)) {
        img.setAttribute('alt', alt);
    }
    return img;
}