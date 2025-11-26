import * as ui from "../ui";
import { ElementHasClass, GetParentWithClass, isBlank, StringAlphanumericOnly } from "../lilutils";
import { HelpIcon } from "./helpicon";

export const basicComponentClass = '__UICOMP';

/**
 * If this is a {@linkcode TitledComponent}, should this 
 * component's {@linkcode TitledComponent.title title}, 
 * stripped of all non-alphanumeric characters, be appended 
 * to {@linkcode uniqueComponentName}? @type {boolean} */
const INCLUDE_COMPONENT_TITLE_IN_UNIQUE_NAME = true;

export class BasicComponent {
    /** @type {HTMLElement} */
    div;
    hasBeenLoaded = false;
    hasBeenAddedToPage = false;
    /** @type {Element} */
    #parentPage;
    /** @type {Number} */
    static componentCount = 0;
    /** @type {BasicComponent[]} */
    static allComponents = [];
    /** @type {HTMLDivElement[]} */
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
        let uniqueComponentName = `_uiComponent${this.uniqueComponentID}`;
        if (INCLUDE_COMPONENT_TITLE_IN_UNIQUE_NAME && this instanceof TitledComponent) {
            if (this.title != null) {
                let ucn = StringAlphanumericOnly(this.title);
                if (!isBlank(ucn)) {
                    uniqueComponentName += `_${ucn}`;
                }
            }
        }
        return uniqueComponentName;
    }
    /** page that this component has been added to. should only be accessed after UI has finished loading. 
     * @type {Element} */
    get parentPage() {
        if (this.#parentPage == null) {
            if (this.div == null || this.div.parentElement == null) {
                console.warn(`WARNING: can't get parent page for component with null/unparented div, component: ${this.uniqueComponentName}`);
                return null;
            }
            this.#parentPage = GetParentWithClass(this.div, 'page');
            if (this.#parentPage == null) {
                console.warn(`WARNING: can't get parent page for component ${this.uniqueComponentName}, no parent has css class 'page'`);
                return null;
            }
        }
        return this.#parentPage;
    }
    set parentPage(page) {
        if (!ElementHasClass(page, 'page')) {
            console.warn(`WARNING: can't set component ${this.uniqueComponentName} parent page, page div doesn't have class 'page', page div: ${page}`);
            return;
        }
        this.#parentPage = page;
    }
    /** Convenience method to bypass appendChild on component directly to its div 
     * @param {Element} child */
    appendChild(child) {
        this.div.appendChild(child);
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

    /** @type {HTMLElement} */
    #titleElement;
    /** @type {string} */
    #titleText;
    /** @type {HelpIcon} */
    #helpIcon;

    /**
     * TitledComponent constructor, auto-compiling the title div 
     * @param {string} [componentTitle] Optional title to add to this component 
     * @param {boolean} [createTitleDiv = true] auto-create title div? Default `true`
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
            if (!text || isBlank(text)) {
                this.#titleElement.style.display = 'none';
            } else {
                this.#titleElement.style.display = '';
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
        this.#updateTitle();
    }
    /** @returns {HTMLElement} Element for the title */
    get _titleElement() { return this.#titleElement; }

    /** Reassigns `title` to itself, re-invoking the setter method @returns {void} */
    #updateTitle() { this.title = this.title; }

    /**
     * Adds (or updates the text of) a {@linkcode HelpIcon} to this component, and returns it 
     * @param {string} helpText 
     * @param {boolean} [togglePos=false] 
     * @param {boolean} [rightJustify=true] 
     * @returns {HelpIcon}
     */
    addHelpIcon(helpText, togglePos = false, rightJustify = true) {

        if (this.#helpIcon) {
            console.warn(`help icon already exists, just updating its values instead, element: ${this.#helpIcon}`)
            // TODO: replace help text reset with actual text, not null/lipsum
            // Issue URL: https://github.com/nickyonge/evto-web/issues/35
            this.#helpIcon.setText(helpText, null);
            return this.#helpIcon;
        }

        // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
        if (togglePos) {
            this.#helpIcon = new HelpIcon(this.div, helpText, togglePos, rightJustify);
        } else {
            // this.#helpIcon = new HelpIcon(this.div, helpText, togglePos);
            this.#helpIcon = new HelpIcon(this.#titleElement, helpText, togglePos, rightJustify);
        }
        return this.#helpIcon;
    }
}
