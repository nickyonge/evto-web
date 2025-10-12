import { isBlank, isString, StringAlphanumericOnly, StringContainsAlpha, StringContainsAlphanumeric, StringNumericOnly, StringRemoveAlpha, StringRemoveAlphanumeric } from "../lilutils";
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
        bgr.gradient.sharpGradient = true;
        bgr.gradient.isRadial = false;
        bgr.gradient.scale = 1;

        // console.log("scale test 1 (2) ......... : " + bgr.gradient.ScaleValue(1));
        // console.log("scale test 2 (213) ....... : " + bgr.gradient.ScaleValue(213 / 2));
        // console.log("scale test 3 (720.667) ... : " + bgr.gradient.ScaleValue('360.333333333333'));
        // console.log("scale test 4 (200px) ..... : " + bgr.gradient.ScaleValue('100px'));
        // console.log("scale test 5 (100,200,666) : " + bgr.gradient.ScaleValue('onehun50, twohun100!evilpx: 333px'));

        console.log(bgr.gradient.html);
        bgr.gradient.scale = 1;
        console.log(bgr.gradient.html);
        // bgr.gradient.isRadial = true;
        // bgr.gradient.mirror = true;
        console.log(bgr.gradient.html);
        this.#image.innerHTML = bgr.html;

    }
}
