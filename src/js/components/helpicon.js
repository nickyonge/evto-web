import * as ui from "../ui";
import iconHelp from '../../assets/svg/icons-white/icon-help.svg';
import * as txt from "../text";

const rightJustifyDefaultIcons = true;

export class HelpIcon {
    #helpDiv;
    #iconImg;
    constructor(parentDiv, helpText, togglePos = false) {
        this.#helpDiv = togglePos ?
            ui.CreateDivWithClass('helpDiv', 'togglePos') :
            rightJustifyDefaultIcons ?
            ui.CreateDivWithClass('helpDiv', 'rightJustify') :
            ui.CreateDivWithClass('helpDiv');
        this.#iconImg = ui.CreateImage(iconHelp, txt.HELPICON_ALT);
        ui.AddClassToDOMs('helpIcon', this.#iconImg);
        this.#helpDiv.appendChild(this.#iconImg);
        parentDiv.appendChild(this.#helpDiv);
    }
}