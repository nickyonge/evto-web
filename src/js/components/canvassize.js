import * as ui from "../ui";
import { TitledComponent } from "./base";
import * as txt from '../text';

export class CanvasSize extends TitledComponent {

    #imageContainer;

    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassToDOMs('canvasSize', this.div);
        this.#imageContainer = ui.CreateDivWithClass('canvasSize', 'imageContainer');
        this.div.appendChild(this.#imageContainer);

    }

}