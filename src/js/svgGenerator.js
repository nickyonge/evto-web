const FANCYBOX_MAX_SPLITS = 3;
const FANCYBOX_FIRST_SPLIT_IS_BASE = true;

const SVG_DEFAULT_X = 0;
const SVG_DEFAULT_Y = 0;
const SVG_DEFAULT_WIDTH = 200;
const SVG_DEFAULT_HEIGHT = 100;
const SVG_DEFAULT_FILL = '#beeeef';
const SVG_DEFAULT_STROKE = 'none';

export function CreatePath() {

}

export function CreateBox(x = SVG_DEFAULT_X, y = SVG_DEFAULT_Y, width = SVG_DEFAULT_WIDTH, height = SVG_DEFAULT_HEIGHT) {

}

export class svgRect {
    x = SVG_DEFAULT_X;
    y = SVG_DEFAULT_Y;
    width = SVG_DEFAULT_WIDTH;
    height = SVG_DEFAULT_HEIGHT;
    fill = SVG_DEFAULT_FILL;
    stroke = SVG_DEFAULT_STROKE;

    /** 
     * Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<string[]>} */
    extraAttributes = [];

    constructor(x = SVG_DEFAULT_X, y = SVG_DEFAULT_Y, width = SVG_DEFAULT_WIDTH, height = SVG_DEFAULT_HEIGHT) {
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

export function SVGBasicBoxD(x = SVG_DEFAULT_X, y = SVG_DEFAULT_Y, width = SVG_DEFAULT_WIDTH, height = SVG_DEFAULT_HEIGHT,
    relativeStart = false, closePath = true) {
    return `${relativeStart ? 'm' : 'M'}${x},${y} h${width} v${height} h${-width} ${closePath ? 'Z' : `v${-height}`}`;
}