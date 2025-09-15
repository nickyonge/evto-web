import * as ui from "../ui";
import { TitledComponent } from "./base";
import { ObserveNode, ObserverCallbackOnAdded } from "../mutationObserver";
import { GetChildWithClass, GetCSSVariable, GetSiblingWithClass } from "../lilutils";
const initialValue = 0;

const _smootherScroll = true;

export class DropdownList extends TitledComponent {

    #dropdown;
    #selected;
    #svg;
    #optionsContainer;
    #optionsDivs;
    #optionsInputs;
    #optionsLabels;
    #optionsCosts;
    #optionsCostsP;

    static _dropdownMaxHeight = -1;

    #initialChange = false;

    constructor(componentTitle, onSelectCallback, options, costs, icons) {
        super(componentTitle);

        if (DropdownList._dropdownMaxHeight < 0) {
            DropdownList._dropdownMaxHeight = parseInt(GetCSSVariable('--ui-component-dropdown-max-height'), 10);
        }

        // TODO: token display in selected dropdown option 

        ui.AddClassesToDOM(this.div, 'dropdownContainer');
        this._titleElement = ui.CreateDivWithClass('componentTitle', 'listTitle');
        this.#dropdown = ui.CreateDivWithClass('dropdown');
        ObserverCallbackOnAdded(this.#dropdown, this.DropdownAddedToPage);
        ObserverCallbackOnAdded(this.div, this.DivAddedToPage);
        // ObserverCallbackOnAdded(this.#dropdown, this.DropdownAddedToPage);
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
        this.#optionsCosts = [];
        this.#optionsCostsP = [];
        this.#optionsContainer = ui.CreateDivWithClass('ddOptions');
        ObserverCallbackOnAdded(this.#optionsContainer, this.OptionsAddedToPage);
        // iterate thru options 
        for (let i = 0; i < options.length; i++) {
            // create elements
            let isChecked = i == initialValue;
            let hasCost = (costs && costs.length > i);
            let oDiv = ui.CreateDiv();
            let uniqueName = `${this.uniqueComponentName}_o${i}`;
            let oInput = ui.CreateInputWithID('radio', uniqueName);
            ui.AddElementAttribute(oInput, 'name', 'ddOption');
            oInput.defaultChecked = isChecked;
            oInput.checked = isChecked;
            let oLabel = ui.CreateElementWithClass('label', 'ddOption');
            if (hasCost) { ui.AddClassToDOMs('withCost', oLabel); }
            ui.AddElementAttributes(oLabel, ['for', 'data-txt'], [uniqueName, options[i]]);
            // ensure correct checked background
            if (isChecked) {
                oLabel.style.backgroundColor = GetCSSVariable('--ui-component-color-enabled-dark');
            }
            // push to arrays
            this.#optionsDivs.push(oDiv);
            this.#optionsInputs.push(oInput);
            this.#optionsLabels.push(oLabel);
            ui.MakeTabbableWithInputTo(oLabel, oInput);
            // add children to parents 
            oDiv.appendChild(oInput);
            oDiv.appendChild(oLabel);
            // add costs field 
            if (hasCost) {
                if (costs[i] == null) {
                    this.#optionsCosts.push(null);
                    continue;
                }
                let oCost = ui.CreateDivWithClass('cost', 'floating');
                let oCostP = ui.CreateElement('p');
                oCost.appendChild(oCostP);
                oCostP.innerHTML = `${costs[i]}`;
                this.#optionsCosts.push(oCost);
                this.#optionsCostsP.push(oCostP);
                oLabel.appendChild(oCost);
                if (isChecked) {
                    oCost.style.backgroundColor = GetCSSVariable('--color-ui-costToken-selected-bg-inner');
                    oCost.style.borderColor = GetCSSVariable('--color-ui-costToken-selected');
                    oCost.style.boxShadow = `0px 0px 0.69px 1.5px ${GetCSSVariable('--color-ui-costToken-selected-bg-outer')}`;
                    oCostP.style.color = GetCSSVariable('--color-ui-costToken-selected');
                }
            }
            // add option div to options container
            this.#optionsContainer.appendChild(oDiv);

            // create change callback
            oInput.addEventListener('change', (event) => {
                this.#updateSelection();
                if (onSelectCallback) {
                    onSelectCallback(event.target.id);
                }
                if (!this.#initialChange) {
                    // initial option wasn't appearing as selected, manually set and un-set appearance 
                    this.#optionsLabels[initialValue].style.backgroundColor = null;
                    this.#initialChange = true;
                    if (this.#optionsCosts != null && this.#optionsCosts.length > initialValue && this.#optionsCosts[initialValue] != null) {
                        this.#optionsCosts[initialValue].style.backgroundColor = null;
                        this.#optionsCosts[initialValue].style.borderColor = null;
                        this.#optionsCosts[initialValue].style.boxShadow = null;
                        this.#optionsCostsP[initialValue].style.color = null;
                    }
                }
            });
        }
        // add elements 
        this.div.appendChild(this._titleElement);
        this.div.appendChild(this.#dropdown);
        this.#dropdown.appendChild(this.#selected);
        this.#selected.appendChild(this.#svg);
        this.#dropdown.appendChild(this.#optionsContainer);

        // add resize event 
        window.addEventListener('resize', function () {
            // re-fire size assignment events on page resize
            this.DropdownAddedToPage(this.#dropdown);
            this.OptionsAddedToPage(this.#optionsContainer);
        }.bind(this));

        // add help component
        this._addHelpIcon(`help me! ${componentTitle}`);

        // set initial selection 
        this.#forceSelectionIndex = initialValue;
    }

    DivAddedToPage(target) { // this.div
        // add scroll event
        if (_smootherScroll) {
            target.parentElement.addEventListener('scroll', () => {
                requestAnimationFrame(() => {
                    const title = GetChildWithClass(target, 'componentTitle');
                    const dropdown = GetChildWithClass(target, 'dropdown');
                    const titleRect = title.getBoundingClientRect();
                    dropdown.style.top = `${titleRect.bottom}px`;
                });
            });
        } else {
            target.parentElement.addEventListener('scroll', function () {
                // ui.GetAttribute(target, 'uniqueComponentID')
                let title = GetChildWithClass(target, 'componentTitle');
                let dropdown = GetChildWithClass(target, 'dropdown');
                let titleRect = title.getBoundingClientRect();
                dropdown.style.top = `${titleRect.bottom}px`;
                // dropdown.style.top = `0px`;
                // dropdown.style.transform = `translateY(${titleRect.bottom}px)`;
            });
        }
    }
    DropdownAddedToPage(target) { // this.#dropdown 
        // let listTitle = GetSiblingWithClass(target, 'listTitle');
        target.style.width = `${target.parentElement.offsetWidth - 4.5}px`;
    }
    OptionsAddedToPage(target) { // this.#optionsContainer 
        // determine if window height exceeds max, and if so, add scrollbar
        let targetHeight = target.offsetHeight;
        if (targetHeight > DropdownList._dropdownMaxHeight) {
            target.style.setProperty('overflow-y', 'scroll');
        }
    }

    #updateSelection() {
        ui.AddElementAttribute(this.#selected, 'data-label', this.selection);
    }

    set selection(sel) { // this.optionsInputs[i]
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
    set #forceSelectionIndex(index) {
        this.#_forceSI = true;
        this.selectionIndex = index;
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
        if (this.#_forceSI) { this.#_forceSI = false; return -1; }
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
    #_forceSI = false;

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