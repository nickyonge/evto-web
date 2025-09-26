import * as ui from "../ui";
import { GetParentWithClass, isBlank } from "../lilutils";
import { HelpIcon } from "./helpicon";

export const basicComponentClass = '__UICOMP';

export class BasicComponent {
    div;
    onScroll;
    static componentCount = 0;
    static allComponents = [];
    static allComponentDivs = [];
    constructor() {
        BasicComponent.componentCount++;
        this.div = ui.CreateDivWithClass(basicComponentClass, 'uiComponent');
        ui.AddElementAttribute(this.div, 'uniqueComponentID', BasicComponent.componentCount);
        BasicComponent.allComponents.push(this);
        BasicComponent.allComponentDivs.push(this.div);
    }
    get uniqueComponentID() {
        return ui.GetAttribute(this.div, 'uniqueComponentID');
    }
    get uniqueComponentName() {
        return `_uiComponent${this.uniqueComponentID}`;
    }
    static GetComponentByUniqueID(uniqueID) {
        for (let i = 0; i < BasicComponent.allComponentDivs.length; i++) {
            if (ui.GetAttribute(BasicComponent.allComponentDivs[i], 'uniqueComponentID') == uniqueID) {
                return BasicComponent.allComponents[i];
            }
        }
        return null;
    }
    static GetComponentByDiv(div) {
        let divID = ui.GetAttribute(div, 'uniqueComponentID');
        if (!divID) { return null; }
        return BasicComponent.GetComponentByUniqueID(divID);
    }
}
export class TitledComponent extends BasicComponent {

    #titleElement;
    #titleText;

    #helpIcon;

    /**
     * TitledComponent constructor, auto-compiling the 
     * @param {string} componentTitle 
     * @param {boolean} [createTitleDiv = true] auto-create title div? 
     * @param {string[]} [titleClasses=['componentTitle', 'listTitle']] CSS classes to apply to title div (if `createTitleDiv` is true)
     */
    constructor(componentTitle, createTitleDiv = true, titleClasses = ['componentTitle', 'listTitle']) {
        super();
        if (componentTitle) {
            this.title = componentTitle;
        }
        if (createTitleDiv) {
            this._titleElement = ui.CreateDivWithClass(titleClasses);
            this.div.appendChild(this._titleElement);
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

    _addHelpIcon(helpText, togglePos = false, rightJustify = true) {
        // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
        if (togglePos) {
            this.#helpIcon = new HelpIcon(this.div, helpText, togglePos, rightJustify);
        } else {
            // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
            this.#helpIcon = new HelpIcon(this.#titleElement, helpText, togglePos, rightJustify);
        }

    }
}
