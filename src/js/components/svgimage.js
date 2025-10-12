import { isBlank, isString, Lerp, StringAlphanumericOnly, StringContainsAlpha, StringContainsAlphanumeric, StringNumericOnly, StringRemoveAlpha, StringRemoveAlphanumeric } from "../lilutils";
import { BasicGradientRect } from "../svg/svgGenerator";
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

        let bgr = BasicGradientRect('skyblue', 'white', 'pink');
        bgr.gradient.sharpness = 0.213;
        bgr.gradient.isRadial = false;
        bgr.gradient.angle = 90;
        bgr.GetShape().fillGradient = bgr.gradient;
        console.log(bgr.html);
        this.#image.innerHTML = bgr.html;

    }
}
