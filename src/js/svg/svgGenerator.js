import { isBlank } from "../lilutils";
import * as svg from './index';
import { asset } from "./index";

const FANCYBOX_MAX_SPLITS = 3;
const FANCYBOX_FIRST_SPLIT_IS_BASE = true;


export function CreatePath() {

    let a = new asset();

    a.AddCircle();
    a.AddCircle();
    a.AddRect();

    console.log(a.html);
}

export function CreateBox(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT) {
}

export class svgBox {
    x = svg.default.X;
    y = svg.default.Y;
    width = svg.default.WIDTH;
    height = svg.default.HEIGHT;
    fill = svg.default.FILL;
    stroke = svg.default.STROKE;

    /** 
     * Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    extraAttributes = [];

    constructor(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get d() {
        return `M${this.x},${this.y} h${this.width} v${this.height} h${-this.width} Z`;
    }

    get path() {

    }
}

export class svgFancyBox {

    x;
    y;
    width;
    height;

    splitCount = 0;//0 to FANCYBOX_MAX_SPLITS
    angle = 0;// -1 to 1
    waveCount = 0;// 0 to 
    waveHeight = 0.5;
    waveFlip = false;
    horizontal = true;

    get ds() {

        if (this.splitCount < 0 || this.splitCount > FANCYBOX_MAX_SPLITS) {
            console.warn(`WARNING: invalid split count ${this.splitCount}, must be between 0 and ${FANCYBOX_MAX_SPLITS} (inclusive), returning null`);
            return null;
        }

        if (this.splitCount == 0) {
            return [SVGBasicBoxD(this.x, this.y, this.width, this.height)];
        }

        let ds = [];

        // local reference functions to convert fractions to appropriate width/height 
        function w(value) { return this.width * value; }
        function h(value) { return this.height * value; }

        // iterate through split count
        for (let i = 0; i <= this.splitCount; i++) {
            if (FANCYBOX_FIRST_SPLIT_IS_BASE && i == 0) {
                // first path, generate full basic SVG
                ds.push(SVGBasicBoxD(this.x, this.y, this.width, this.height));
                continue;
            }
            let interval = i / this.splitCount + 1;// eg, 1 split should be at 50%, 2 at 33% and 66%, etc
            let steps = [`M${this.horizontal ? `0,${h(0.5)}` : `${w(0.5)},0`}`];
            // draw line
            steps.push(`L${w(1)},${h(0.5)}`);
            // combine and push
            ds.push(steps.join(' '));
        }
        // return
        return ds;
    }
}

/**
 * Create a `d` attribute {@link svg.path path} making up a rectangle 
 * @see {@link svg.rect}
 * @param {number} x {@link svg.default.X}
 * @param {number} y {@link svg.default.Y}
 * @param {number} width {@link svg.default.WIDTH}
 * @param {number} height {@link svg.default.HEIGHT}
 * @param {boolean} [relativeStart=false] If false, start `d` path with an `M` command; if true, `m`
 * @param {boolean} [closePath=true] End `d` path with a `Z` command?
 * @returns {string}
 */
export function SVGBasicBoxD(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT,
    relativeStart = false, closePath = true) {
    return `${relativeStart ? 'm' : 'M'}${x},${y} h${width} v${height} h${-width} ${closePath ? 'Z' : `v${-height}`}`;
}

/**
 * Parse array of SVG data, into HTML-attribute-style `name="value"` format, 
 * with spaces between attributes as needed.
 * @param {Array<[string, any]>} data 2d array of properties, `[name,value]` 
 * @returns {string} data formatted like `first="1" second="2" third="3"`*/
export function ParseData(data) {
    let d = [];
    data.forEach(datum => {
        let out = ParseDatum(datum[0], datum[1]);
        if (!isBlank(out)) { d.push(out); }
    });
    return d.join(' ');
}
/** Parse individual property data for use as an SVG attribute. Returns `''` if invalid.
 * @param {string} name name of property. Can't be null or blank or whitespace
 * @param {*} value value of property. Can't be null, but CAN be blank or whitespace
 * @returns {string} datum formatted like `myName="myValue"`, or `''` if name is empty/null or value is null*/
function ParseDatum(name, value) { return `${value == null || isBlank(name) ? '' : `${name}="${value}"`}`; }
