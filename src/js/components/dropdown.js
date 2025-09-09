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

        ui.AddClassesToDOM(this.div, 'dropdownContainer');
        this._titleElement = ui.CreateDivWithClass('componentTitle', 'listTitle');
        this.#dropdown = ui.CreateDivWithClass('dropdown');
        this.#selected = ui.CreateDivWithClass('ddSelected');
        ui.MakeTabbable(this.#dropdown);
        if (options && options.length >= initialValue + 1) {
            ui.AddElementAttribute(this.#selected, 'data-label', options[initialValue]);
        } else {
            ui.AddElementAttribute(this.#selected, 'data-label', '');
        }
        // create dropdown arrow SVG
        // TODO: arrow SVG path is not appearing
        this.#svg = ui.CreateSVG(
            [[arrowSVGPath, '#ffffff']],
            [
                // ['height', '1em'], 
                ['viewBox', '0 0 512 512']
            ],
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
            let uniqueName = `${this.uniqueComponentName}_o${i}`;
            let oInput = ui.CreateInputWithID('radio', uniqueName);
            ui.AddElementAttribute(oInput, 'name', 'ddOption');
            oInput.defaultChecked = i == initialValue;
            let oLabel = ui.CreateElementWithClass('label', 'ddOption');
            ui.AddElementAttributes(oLabel, ['for', 'data-txt'], [uniqueName, options[i]]);
            // push to arrays
            this.#optionsDivs.push(oDiv);
            this.#optionsInputs.push(oInput);
            this.#optionsLabels.push(oLabel);
            ui.MakeTabbableWithInputTo(oLabel, oInput);
            // add children to parents 
            oDiv.appendChild(oInput);
            oDiv.appendChild(oLabel);
            this.#optionsContainer.appendChild(oDiv);

            // create callback
            oInput.addEventListener('change', (event) => {
                this.#updateSelection();
                if (onSelectCallback) {
                    onSelectCallback(event.target.id);
                }
            });
        }
        // add elements 
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#dropdown);
        this.#dropdown.appendChild(this.#selected);
        this.#selected.appendChild(this.#svg);
        this.#dropdown.appendChild(this.#optionsContainer);

        document.addEventListener('keydown', function (event) {
            // Check which key was pressed
            if (event.key === 'g') {
                this.gg++;
                if (this.gg > 2) { this.gg = 0; }
                // this.selectionIndex = this.gg;
                this.selection = 'b';
            }

        }.bind(this));
    }

    gg = 0;

    #updateSelection() {
        console.log(this.selection);
        ui.AddElementAttribute(this.#selected, 'data-label', this.selection);
    }

    set selection(sel) {
        if (sel == this.selection) { return; }
        if (!this.#isValidSelection(sel)) {
            console.warn(`WARNING: can't assign invalid selection ${sel}`);
            return;
        }
        // first, check labels
        for (let i = 0; i < this.#optionsLabels.length; i++) {
            this.#optionsLabels[i].checked = ui.GetAttribute(this.#optionsLabels[i], 'data-txt') == sel;
        }
        // if not found, check input IDs, just in case we're using technical name
        for (let i = 0; i < this.#optionsInputs.length; i++) {
            this.#optionsInputs[i].checked = this.#optionsInputs[i].id == sel;
        }
        this.#updateSelection();
    }
    set selectionIndex(index) {
        if (index == this.selectionIndex) { return; }
        if (!this.#isValidSelectionIndex(index)) {
            console.warn(`WARNING: can't assign invalid selection index ${index}`);
            return;
        }
        for (let i = 0; i < this.#optionsInputs.length; i++) {
            this.#optionsInputs[i].checked = i == index;
        }
        this.#updateSelection();
    }

    /** returns the text of the current selection 
     * @returns {string} text value of the current selection, or `null` if none/invalid */
    get selection() {
        let i = this.selectionIndex;
        if (i == -1) { return null; }
        // return this.#optionsInputs[i].id;
        return ui.GetAttribute(this.#optionsLabels[i], 'data-txt');
    }

    /** returns the index of the current selection 
     * @returns {number} integer index of the current selection, or `-1` if none/invalid */
    get selectionIndex() {
        if (!this.#optionsInputs) {
            return -1;
        }
        for (let i = 0; i < this.#optionsInputs.length; i++) {
            if (this.#optionsInputs[i].checked) {
                return i;
            }
        }
        return -1;
    }

    #isValidSelection(s) {
        for (let i = 0; i < this.#optionsInputs.length; i++) {
            if (this.#optionsInputs[i].id == s) {
                return true;
            }
        }
        return false;
    }
    #isValidSelectionIndex(i) {
        return (i >= 0 && i < this.#optionsInputs.length);
    }
}

/** path `d` attribute for SVG arrow */
const arrowSVGPath = 'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z';