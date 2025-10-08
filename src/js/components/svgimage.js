import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

export class SVGImage extends BasicComponent {
    // export class SVGImage extends TitledComponent {

    constructor() {
        super();
        // constructor(componentTitle) {
        // super(componentTitle);

        ui.CreateSVG();
    }
}
