
const _useDemoBGColors = true;

let topBar = null;
let content = null;
let artWindow = null;
let dataWindow = null;
let btmBar = null;

export function BuildUI() {

    // top bar
    content = CreateDivWithClass('content');
    topBar = CreateDivWithClass('topBar');
    btmBar = CreateDivWithClass('btmBar');
    
    document.body.appendChild(content);
    document.body.appendChild(topBar);
    document.body.appendChild(btmBar);

    artWindow = CreateDivWithClass('content', 'window', 'art');
    dataWindow = CreateDivWithClass('content', 'window', 'data');

    content.appendChild(artWindow);
    content.appendChild(dataWindow);

    if (_useDemoBGColors) {
        AddClassToDOMs('demoBG', topBar, btmBar, dataWindow);
    }

}

function CreateDivWithClass(...cssClasses) {
    let div = document.createElement('div');
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