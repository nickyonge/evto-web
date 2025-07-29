
const useDemoBGColors = false;

let topBar = null;
let content = null;
let artWindow = null;
let dataWindow = null;
let btmBar = null;

export function BuildUI() {

    // top bar
    content = useDemoBGColors ? CreateDivWithClass('content', 'demoBG') : CreateDivWithClass('content');
    topBar = useDemoBGColors ? CreateDivWithClass('topBar', 'demoBG') : CreateDivWithClass('content');
    btmBar = useDemoBGColors ? CreateDivWithClass('btmBar', 'demoBG') : CreateDivWithClass('content');
    
    document.body.appendChild(content);
    document.body.appendChild(topBar);
    document.body.appendChild(btmBar);

}

function CreateDivWithClass(...cssClasses) {
    let div = document.createElement('div');
    div.classList.add(...cssClasses);
    return div;
}