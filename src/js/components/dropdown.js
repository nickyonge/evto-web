import * as ui from "../ui";
import { TitledComponent } from "./base";
const initialValue = 0;

export class DropdownList extends TitledComponent {

    #dropdown;
    #selected;
    #svg;
    #optionsContainer;
    #optionsDivs;
    #optionsInputs;
    #optionsLabels;

    constructor(componentTitle, onSelectCallback, options, icons) {
        super(componentTitle);

        this.div = ui.CreateDivWithClass('dropdownContainer');
        ui.AddClassesToDOM(this.div, 'dropdownContainer');
        this._titleElement = ui.CreateDivWithClass('componentTitle', 'listTitle');
        this.#dropdown = ui.CreateDivWithClass('dropdown');
        this.#selected = ui.CreateDivWithClass('ddSelected');
        if (options && options.length >= initialValue + 1) {
            ui.AddElementAttribute(this.#selected, 'data-label', options[initialValue]);
        } else {
            ui.AddElementAttribute(this.#selected, 'data-label', '');
        }
        // create dropdown arrow SVG
        this.#svg = ui.CreateSVG(
            [[arrowSVGPath, '#ffffff']],
            [['height', '1em'], ['viewBox', '0 0 512 512']],
            'ddArrow');
        // create menu options 
        this.#optionsDivs = [];
        this.#optionsInputs = [];
        this.#optionsLabels = [];
        this.#optionsContainer = ui.CreateDivWithClass('ddOptions');
        // iterate thru options 
        for (let i = 0; i < options.length; i++) {
            // create elements
            let oDiv = ui.CreateDiv();
            let oInput = ui.CreateInputWithID('radio', options[i]);
            if (i == initialValue) {
                ui.AddElementAttributes(oInput, ['name', 'checked'], ['ddOption', '']);
            } else {
                ui.AddElementAttribute(oInput, 'name', 'ddOption');
            }
            let oLabel = ui.CreateElementWithClass('label', 'ddOption');
            ui.AddElementAttributes(oLabel, ['for', 'data-txt'], [options[i], options[i]]);
            // push to arrays
            this.#optionsDivs.push(oDiv);
            this.#optionsInputs.push(oInput);
            this.#optionsLabels.push(oLabel);
            // add children to parents 
            oDiv.appendChild(oInput);
            oDiv.appendChild(oLabel);
            this.#optionsContainer.appendChild(oDiv);
        }
        // add elements 
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#dropdown);
        this.#dropdown.appendChild(this.#selected);
        this.#selected.appendChild(this.#svg);
        this.#dropdown.appendChild(this.#optionsContainer);
    }
}

/** path `d` attribute for SVG arrow */
const arrowSVGPath = 'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z';