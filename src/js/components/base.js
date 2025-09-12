import * as ui from "../ui";
import { isBlank } from "../lilutils";
import { HelpIcon } from "./helpicon";

export class BasicComponent {
    div;
    static componentCount = 0;
    static allComponents = [];
    constructor() {
        this.div = ui.CreateDivWithClass("uiComponent");
        ui.AddElementAttribute(this.div, 'uniqueComponentID', BasicComponent.componentCount);
        BasicComponent.componentCount++;
        BasicComponent.allComponents.push(this.div);
    }
    get uniqueComponentID() {
        return ui.GetAttribute(this.div, 'uniqueComponentID');
    }
    get uniqueComponentName() {
        return `_uiComponent${this.uniqueComponentID}`;
    }
    static GetComponentByUniqueID(uniqueID) {
        for (let i = 0; i < BasicComponent.allComponents.length; i++) {
            if (ui.GetAttribute(BasicComponent.allComponents[i], 'uniqueComponentID') == uniqueID) {
                return BasicComponent.allComponents[i];
            }
        }
        return null;
    }
}
export class TitledComponent extends BasicComponent {

    #titleElement;
    #titleText;

    #helpIcon;

    constructor(componentTitle) {
        super();
        if (componentTitle) {
            this.title = componentTitle;
        }
        
    }

    /** Get/set the title text for this toggle switch. Automatically updates HTML.
     * @type {string} Title text to assign */
    set title(text) {
        this.#titleText = text;
        if (this.#titleElement) {
            if (!text || text.isBlank) {
                this.#titleElement.style.visibility = 'hidden';
            } else {
                this.#titleElement.style.visibility = 'visible';
                this.#titleElement.innerHTML = text;
            }
        }
    }
    /** @returns {string} title of this component */
    get title() {
        return this.#titleText;
    }

    /** get/set the title HTML element, auto-updates the text on set 
     * @type {HTMLElement} */
    set _titleElement(titleElement) {
        if (!titleElement) { return; }
        ui.AddClassToDOMs('componentTitle', titleElement);
        ui.DisableContentSelection(titleElement);// disable selecting text
        this.#titleElement = titleElement;
        this._updateTitle();
    }
    /** @returns {HTMLElement} Element for the title */
    get _titleElement() { return this.#titleElement; }

    /** Reassigns `title` to itself, re-invoking the setter method */
    _updateTitle() { this.title = this.title; }

    _addHelpIcon(helpText, togglePos = false) {
        // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
        if (togglePos) {
            this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
        } else {
            // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
            this.#helpIcon = new HelpIcon(this.#titleElement, helpText, togglePos);
        }

    }
}
