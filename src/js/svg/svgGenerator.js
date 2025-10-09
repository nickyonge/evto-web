import { isBlank } from "../lilutils";
import { shape, rect, circle, ellipse, line, polyline, polygon, path } from "./index";
import * as svg from './index';

const FANCYBOX_MAX_SPLITS = 3;
const FANCYBOX_FIRST_SPLIT_IS_BASE = true;

const SVG_HTML_NEWLINE = true;
const SVG_HTML_INDENT = true;

export function CreatePath() {

    let a = new svgAsset();

    a.AddCircle();
    a.AddCircle();
    a.AddRect();

    console.log(a.html);
}

export function CreateBox(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT) {
}

export class svgAsset {
    class;
    id;
    definitions;
    preserveAspectRatio;
    viewBox;
    svgShapes;
    metadata;

    constructor(shapes = [], viewBox = new svgViewBox()) {
        this.svgShapes = shapes;
        this.viewBox = viewBox;
        this.metadata = svg.default.DEFAULT_SVG_METADATA;
    }
    get html() {
        let d = this.data;
        let svg = isBlank(d) ? '<svg>' : `<svg ${d}>`;
        if (SVG_HTML_NEWLINE) { svg += '\n'; }
        // add SVG definitions
        // TODO: svg definitions in own <defs> dropdown
        // Issue URL: https://github.com/nickyonge/evto-web/issues/46
        // add SVG shapes 
        if (this.svgShapes != null && this.svgShapes.length > 0) {
            this.svgShapes.forEach(shape => {
                if (shape == null) { return; }
                let h = shape.html;
                if (!isBlank.h) {
                    if (SVG_HTML_INDENT) { svg += '\t'; }
                    svg += h;
                    if (SVG_HTML_NEWLINE) { svg += '\n'; }
                }
            });
        }
        return `${svg}</svg>`;
    }
    get data() {
        if (this.viewBox == null) { this.viewBox = new svgViewBox(); }
        if (this.metadata == null) { this.metadata = svg.default.DEFAULT_SVG_METADATA; }
        let d = ParseData([
            ['class', this.class],
            ['id', this.id],
            ['preserveAspectRatio', this.preserveAspectRatio]
        ]);
        return [ParseData(this.metadata), d, this.viewBox.html].filter(Boolean).join(' ');
    }

    /** 
     * add an {@link svg.shape} to shapes array (recommend using another shape; 
     * else, must manually assign `type`) @param {shape} shape */
    AddShape(shape) { this.svgShapes.push(shape); }
    AddShape(fill = svg.default.DEFAULT_FILL) { this.svgShapes.push(new shape(fill)); }

    /** add an {@link svg.rect} to shapes array @param {svg.rect} rect */
    AddRect(rect) { this.svgShapes.push(rect); }
    AddRect(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new rect(x, y, width, height, fill));
    }

    /** add an {@link svg.circle} to shapes array @param {circle} circle */
    AddCircle(circle) { this.svgShapes.push(circle); }
    AddCircle(r = svg.default.DEFAULT_R, cx = svg.default.DEFAULT_CX, cy = svg.default.DEFAULT_CY, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new circle(r, cx, cy, fill));
    }

    /** add an {@link svg.ellipse} to shapes array @param {ellipse} ellipse */
    AddEllipse(ellipse) { this.svgShapes.push(ellipse); }
    AddEllipse(rx = svg.default.DEFAULT_RX, ry = svg.default.DEFAULT_RY, cx = svg.default.DEFAULT_CX, cy = svg.default.DEFAULT_CY, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new ellipse(rx, ry, cx, cy, fill));
    }

    /** add an {@link svg.line} to shapes array @param {line} line */
    AddLine(line) { this.svgShapes.push(line); }
    AddLine(x1 = svg.default.DEFAULT_X1, y1 = svg.default.DEFAULT_Y1, x2 = svg.default.DEFAULT_X2, y2 = svg.default.DEFAULT_Y2, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new line(x1, y1, x2, y2, fill));
    }

    /** add an {@link svg.polyline} to shapes array @param {polyline} polyline */
    AddPolyline(polyline) { this.svgShapes.push(polyline); }
    AddPolyline(points = svg.default.DEFAULT_POINTS, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new polyline(points, fill));
    }

    /** add an {@link svg.polygon} to shapes array @param {polygon} polygon */
    AddPolygon(polygon) { this.svgShapes.push(polygon); }
    AddPolygon(points = svg.default.DEFAULT_POINTS, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new polygon(points, fill));
    }

    /** add an {@link svg.path} to shapes array @param {path} path */
    AddPath(path) { this.svgShapes.push(path); }
    AddPath(d = svg.default.DEFAULT_D, fill = svg.default.DEFAULT_FILL) {
        this.svgShapes.push(new path(d, fill));
    }

}

class svgViewBox {
    x; y; width; height;
    constructor(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get html() { return `viewBox="${this.data}"`; }
    get data() { return `${this.x} ${this.y} ${this.width} ${this.height}`; }
}

export class svgBox {
    x = svg.default.DEFAULT_X;
    y = svg.default.DEFAULT_Y;
    width = svg.default.DEFAULT_WIDTH;
    height = svg.default.DEFAULT_HEIGHT;
    fill = svg.default.DEFAULT_FILL;
    stroke = svg.default.DEFAULT_STROKE;

    /** 
     * Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    extraAttributes = [];

    constructor(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT) {
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

export function SVGBasicBoxD(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT,
    relativeStart = false, closePath = true) {
    return `${relativeStart ? 'm' : 'M'}${x},${y} h${width} v${height} h${-width} ${closePath ? 'Z' : `v${-height}`}`;
}

/**
 * Parse array of data, into HTML-attribute-style `name="value"` format, 
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
