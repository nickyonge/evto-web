// script to create internal content on each page in the data window
// just didn't like how long uiData.js was getting
import * as ui from "../ui";
import * as txt from '../text';
import * as cost from '../costs';
import * as cmp from '../components';
import { PG_INTRO, PG_SIZE, PG_FEATURES, PG_PATTERN, PG_SAVE } from "../contentData";
import { GetPageNumberByID, pageHeaders } from "../uiData";
import { GetAllChildrenWithClass } from "../lilutils";
import { basicComponentClass } from "../components/base";
import { canvasDisplayAspectRatio } from "../components/canvassize";
import * as pages from './index';

// TODO: separate Page out as a class, not just a concept 
// Issue URL: https://github.com/nickyonge/evto-web/issues/62

/**
 * Creates the content in a page itself, using the page's `id` to determine page type.
 * @param {HTMLElement} page Element of the page itself 
 */
export function CreatePage(page) {
    // add unique page content 

    // nullcheckery 
    if (!page) {
        throw new Error("ERROR: can't CreatePageContent, page is null");
    } else if (!page.id) { throw new Error(`ERROR: can't CreatePageContent, page.id is null, page: ${page}`); }

    // let pageNumber = GetPageNumberByID(page.id);

    // universal page header
    let header = ui.CreateElement('h2');
    header.innerHTML = '';
    pageHeaders.push(header);
    page.appendChild(header);

    // separate functions for each so I don't have to worry about variable name conflicts 
    switch (page.id) {
        case PG_INTRO:
            pages.CreatePageIntro(page);
            break;
        case PG_SIZE:
            pages.CreatePageSize(page);
            break;
        case PG_FEATURES:
            pages.CreatePageFeatures(page);
            break;
        case PG_PATTERN:
            pages.CreatePagePattern(page);
            break;
        case PG_SAVE:
            pages.CreatePageSave(page);
            break;

        default:
            throw new Error(`ERROR: invalid page ID, can't create page content. Page ID: ${page.id}`);
    }
}

export function DemoPageContent(page) {

    function ddCallback(selection) { console.log(`changed: ${selection}`); }
    function cpCallback(color, colorPicker) { console.log(`color changed, ${color}, colorPicker: ${colorPicker.uniqueComponentName}`); }
    // function dCallback() { console.log(`changed: ${dd.selection}`); }

    let cp1 = new cmp.ColorPicker('color picker 1', null, '#ffbb00', false);
    page.appendChild(cp1);
    let cp2 = new cmp.ColorPicker('color picker 2', cpCallback, '#00bbff', false);
    page.appendChild(cp2);


    let dd1 = new cmp.DropdownList('dropdown1', ddCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam'], [[1, 2, 3], [4, null, 6], [7, 8, 9]]);
    page.appendChild(dd1);
    let dd2 = new cmp.DropdownList('dropdown2', ddCallback, ['hello world', 'lorem ipsum dolor sit amet', 'woah black betty blampbalam', 'a', 'b', 'c', '1235387235897293859823598729387592359792837598', 'test', 'ewbai']);
    page.appendChild(dd2);

    let mo = new cmp.MutliOptionList('multi', mCallback, ['a', 'b', 'c'], [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
    function mCallback() { console.log(`changed: ${mo.selection}`); }
    // function mCallback(selection) { console.log(`changed: ${selection}`); }
    page.appendChild(mo);

    let tg = new cmp.Toggle("toggle", tCallback, [1, 2, 3]);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    function tCallback(checked) { console.log('checked: ' + checked); }
    page.appendChild(tg);
    let tg2 = new cmp.Toggle("toggle2", tCallback, [99, null, 999]);
    // function tCallback() { console.log('checked: ' + tg.checked); }
    page.appendChild(tg2);
}

export function DemoGradient(page) {
    let imageField = new cmp.ImageField();
    imageField.CreateDemoSVG();
    page.appendChild(imageField);
    function updateParameter(paramID, value) {
        switch (paramID) {
            case 0: imageField.demoSVG.gradient.isRadial = value; break;
            case 1: imageField.demoSVG.gradient.scale = value; break;
            case 2: imageField.demoSVG.gradient.angle = value; break;
            case 3: imageField.demoSVG.gradient.sharpness = value; break;
            case 4: imageField.demoSVG.gradient.SetColor(0, value); break;
            case 5: imageField.demoSVG.gradient.SetColor(1, value); break;
            case 6: imageField.demoSVG.gradient.SetColor(2, value); break;
            default:
                return;
        }
    }
    let slider1 = new cmp.Slider('scale', function (v) { updateParameter(1, v); }, 1, 0.1, 2.5, false, 0.05);
    let slider2 = new cmp.Slider('angle', function (v) { updateParameter(2, v); }, 0, 0, 360, false);
    slider2.valueSuffix = '°';
    slider2.AddUniqueValueOverride(NaN, 'Linear Only');
    slider2.AddUniqueValueOverride(0, 'Default');
    let slider3 = new cmp.Slider('sharpness', function (v) { updateParameter(3, v); }, 0, 0, 1, true, 0.05);
    let color1 = new cmp.ColorPicker('color1', function (v) { updateParameter(4, v); }, 'skyblue');
    let color2 = new cmp.ColorPicker('color2', function (v) { updateParameter(5, v); }, 'white');
    let color3 = new cmp.ColorPicker('color3', function (v) { updateParameter(6, v); }, 'pink');
    let toggle1 = new cmp.Toggle('radial', function (v) {
        updateParameter(0, v);
        slider2.disabled = v;
    }, null, false);
    page.appendChild(toggle1);
    page.appendChild(slider1);
    page.appendChild(slider2);
    page.appendChild(slider3);
    page.appendChild(color1);
    page.appendChild(color2);
    page.appendChild(color3);
}