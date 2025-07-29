

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

}

function CreateDivWithClass(cssClass) {
    let div = document.createElement('div');
    div.setAttribute('class', cssClass);
    return div;
}