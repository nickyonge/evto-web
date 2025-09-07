import * as ui from "../ui";
import { TitledComponent } from "./base";
export class DropdownList extends TitledComponent {

    #dropdown;
    #selected;
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

        // add elements 
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#dropdown);

    }
}