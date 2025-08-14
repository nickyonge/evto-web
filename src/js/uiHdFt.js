/* Header and Footer UI generation */

import svgGithub from '../assets/svg/github.svg';
import svgInstagram from '../assets/svg/instagram.svg';
import svgBluesky from '../assets/svg/bluesky.svg';

import * as ui from './ui';
import * as txt from './text';

/**
 * Creates the Header (topBar) and Footer (btmBar) for the page
 * @param {Element} topBar the pre-created container element for the topBar 
 * @param {Element} btmBar the pre-created container element for the btmBar
 */
export function CreateHeaderFooter(topBar, btmBar) {
    CreateTopBar(topBar);
    CreateBottomBar(btmBar);
}

// --------------------------------------------- Header (aka TopBar) --- 

function CreateTopBar(topBar) {
    let titleContainer = ui.CreateDivWithClass('title', 'preventSelect');
    // let titleContainer = ui.CreateDivWithClass('title', 'allowSelectDefaultCursor');
    let subtitle = ui.AddElementTo(titleContainer, 'h3');
    let title = ui.AddElementTo(titleContainer, 'h1');
    subtitle.innerText = txt.TITLE;
    title.innerText = txt.SUBTITLE;
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
    ui.MakeTabbableWithInputTo(btn, input);
    return btn;
}


// --------------------------------------------- Footer (aka BtmBar) --- 

function CreateBottomBar(btmBar) {
    // ------------------------------ create social buttons 
    let ul = ui.CreateElementWithClass('ul', 'sbWrapper');
    ul.appendChild(CreateSocialButton('GitHub'));
    ul.appendChild(CreateSocialButton('Instagram'));
    ul.appendChild(CreateSocialButton('Bluesky'));
    btmBar.appendChild(ul);
    // ------------------------------ create mailing list join 
    let mailGroup = ui.CreateDivWithClass('minput-group');
    let mailInput = ui.CreateElementWithClass('input', 'minput');
    mailInput.setAttribute('id', 'Email');
    mailInput.setAttribute('name', 'Email');
    mailInput.setAttribute('placeholder', txt.EMAIL_PLACEHOLDER);
    mailInput.setAttribute('autocomplete', 'off');
    let mailButton = ui.CreateElementWithClass('input', 'mbuttonSubmit');
    mailButton.setAttribute('value', txt.EMAIL_BTN_TEXT);
    mailButton.setAttribute('type', 'submit');
    mailGroup.appendChild(mailInput);
    mailGroup.appendChild(mailButton);
    btmBar.appendChild(mailGroup);
    // create sliding button
    btmBar.appendChild(CreateSlidingButton());
}
function CreateSocialButton(name) {
    let li = ui.CreateElementWithClass('li', 'icon', name.toLowerCase(), 'preventSelect');
    let tt = ui.CreateElementWithClass('span', 'tooltip');
    tt.innerText = name;
    li.appendChild(tt);
    let img = ui.CreateImage(GetSocialImgByName(name), name);
    li.appendChild(img);
    ui.MakeTabbable(li);
    return li;
}

function GetSocialImgByName(name) {
    switch (name.toLowerCase()) {
        case "github":
            return svgGithub;
        case "instagram":
            return svgInstagram;
        case "bluesky":
            return svgBluesky;
    }
    console.warn("Could not GetSocialImgByName from name: " + name);
    return null;
}
function GetSocialTextByName(name) {
    switch (name.toLowerCase()) {
        case "github":
            return txt.SOCIAL_GITHUB;
        case "instagram":
            return txt.SOCIAL_INSTAGRAM;
        case "bluesky":
            return txt.SOCIAL_BLUESKY;
    }
    console.warn("Could not GetSocialTextByName from name: " + name);
    return null;
}

function CreateSlidingButton() {
    let btn = ui.CreateElementWithClass('button', 'slidingbtn');
    let circle = ui.CreateElementWithClass('span', 'circle');
    circle.setAttribute('aria-hidden', 'true');
    circle.appendChild(ui.CreateElementWithClass('span', 'icon', 'arrow'));
    btn.appendChild(circle);
    let text = ui.CreateElementWithClass('span', 'button-text', 'preventSelect');
    text.innerText = txt.SLIDING_BUTTON;
    btn.appendChild(text);
    // let outer = ui.CreateDivWithClass('outer');
    // btn.appendChild(outer);
    ui.MakeTabbable(btn);
    return btn;
}