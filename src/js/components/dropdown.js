import * as ui from "../ui";
import { TitledComponent } from "./base";
export class DropdownList extends TitledComponent {

    #dropdown;
    #selected;
    #svg;
    #optionsContainer;
    #options;

    constructor(componentTitle, onSelectCallback, options, icons) {
        super(componentTitle);

        this.div = ui.CreateDivWithClass('dropdownContainer');
        ui.AddClassesToDOM(this.div, 'dropdownContainer');
        this._titleElement = ui.CreateDivWithClass('componentTitle', 'listTitle');
        this.#dropdown = ui.CreateDivWithClass('dropdown');
        this.#selected = ui.CreateDivWithClass('ddSelected');
        ui.AddElementAttribute(this.#selected, 'data-label', '');

        this.#svg = ui.CreateSVG(
            [[arrowSVGPath, '#ffffff']],
            [['height', '1em'], ['viewBox', '0 0 512 512']],
            'arrow');

        // add elements 
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#dropdown);
        this.#dropdown.appendChild(this.#selected);
        console.log("sel: " + this.#svg);

        this.#selected.appendChild(this.#svg);

    }
}

/** path `d` attribute for SVG arrow */
const arrowSVGPath = 'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z';