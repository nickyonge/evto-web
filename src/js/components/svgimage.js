import * as ui from "../ui";
import { BasicComponent, TitledComponent } from "./base";

// export class SVGImage extends BasicComponent {
export class SVGImage extends TitledComponent {

    #image;

    // constructor() {
    //     super();
    constructor(componentTitle) {
        super(componentTitle);

        ui.AddClassesToDOM(this.div, 'svgImage', 'container');

        this.#image = ui.CreateDivWithClass('image', 'canvasSizedImg');
        this.div.appendChild(this.#image);

        this.#image.innerHTML = '<svg class="gradient-preview" preserveAspectRatio="none" viewBox="0 0 100 100" mlns="http://www.w3.org/2000/svg"><linearGradient id="bwGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="black" /><stop offset="100%" stop-color="white" /></linearGradient><rect x="0" y="0" width="100" height="100" fill="url(#bwGrad)" /></svg>';

    }
}
