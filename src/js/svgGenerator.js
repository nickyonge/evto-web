import { isBlank } from "./lilutils";

const FANCYBOX_MAX_SPLITS = 3;
const FANCYBOX_FIRST_SPLIT_IS_BASE = true;

const DEFAULT_SVG_METADATA = [
    ['xmlns', 'http://www.w3.org/2000/svg'],
    ['xmlns:xlink', 'http://www.w3.org/1999/xlink'],
];

const DEFAULT_X = 0;
const DEFAULT_Y = 0;
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 100;
const DEFAULT_FILL = '#beeeef';
const DEFAULT_STROKE = null;

const DEFAULT_R = DEFAULT_HEIGHT;
const DEFAULT_CX = DEFAULT_X;
const DEFAULT_CY = DEFAULT_Y;

const DEFAULT_RX = 100;// note: ellipse, not used for rect rx
const DEFAULT_RY = DEFAULT_R;// note: ellipse, not used for rect ry

const DEFAULT_X1 = DEFAULT_X;
const DEFAULT_Y1 = DEFAULT_Y;
const DEFAULT_X2 = DEFAULT_WIDTH;
const DEFAULT_Y2 = DEFAULT_HEIGHT;

const DEFAULT_POINTS = [[DEFAULT_X1, DEFAULT_Y1], [DEFAULT_X1, DEFAULT_Y2], [DEFAULT_X2, DEFAULT_Y2], [DEFAULT_X2, DEFAULT_Y1]];

const DEFAULT_D = 'M0,0 L20,0 L20,10 L0,10 Z';

export function CreatePath() {

    let a = new svgAsset();

    a.AddCircle();
    a.AddCircle();
    a.AddRect();

    console.log(a.svgShapes);
}

export function CreateBox(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
}

export class svgAsset {
    class;
    id;
    definitions;
    preserveAspectRatio;
    viewBox;
    svgShapes;
    metadata;

    constructor(svgShapes = [], viewBox = new svgViewBox()) {
        this.svgShapes = svgShapes;
        this.viewBox = viewBox;
        this.metadata = DEFAULT_SVG_METADATA;
    }
    get html() {
        let d = this.data;
        let svg = isBlank(d) ? '<svg>' : `<svg ${allData}>`;
        // add SVG definitions
        // TODO: svg definitions
        // add SVG shapes 
        // TODO: svg shapes
        return svg;
    }
    get data() {
        if (this.viewBox == null) { this.viewBox = new svgViewBox(); }
        if (this.metadata == null) { this.metadata = DEFAULT_SVG_METADATA; }
        let d = ParseData([
            ['class', this.class],
            ['id', this.id],
            ['preserveAspectRatio', this.preserveAspectRatio]
        ]);
        return [d, this.viewBox.html, this.metadata].filter(Boolean).join(' ');
    }

    /** 
     * add an {@link svgShape} to shapes array (recommend using another shape; 
     * else, must manually assign `type`) @param {svgShape} shape */
    AddShape(shape) { this.svgShapes.push(shape); }
    AddShape(fill = DEFAULT_FILL) { this.svgShapes.push(new svgShape(fill)); }

    /** add an {@link svgRect} to shapes array @param {svgRect} rect */
    AddRect(rect) { this.svgShapes.push(rect); }
    AddRect(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgRect(x, y, width, height, fill));
    }

    /** add an {@link svgCircle} to shapes array @param {svgCircle} circle */
    AddCircle(circle) { this.svgShapes.push(circle); }
    AddCircle(r = DEFAULT_R, cx = DEFAULT_CX, cy = DEFAULT_CY, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgCircle(r, cx, cy, fill));
    }

    /** add an {@link svgEllipse} to shapes array @param {svgEllipse} ellipse */
    AddEllipse(ellipse) { this.svgShapes.push(ellipse); }
    AddEllipse(rx = DEFAULT_RX, ry = DEFAULT_RY, cx = DEFAULT_CX, cy = DEFAULT_CY, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgEllipse(rx, ry, cx, cy, fill));
    }

    /** add an {@link svgLine} to shapes array @param {svgLine} line */
    AddLine(line) { this.svgShapes.push(line); }
    AddLine(x1 = DEFAULT_X1, y1 = DEFAULT_Y1, x2 = DEFAULT_X2, y2 = DEFAULT_Y2, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgLine(x1, y1, x2, y2, fill));
    }

    /** add an {@link svgPolyline} to shapes array @param {svgPolyline} polyline */
    AddPolyline(polyline) { this.svgShapes.push(polyline); }
    AddPolyline(points = DEFAULT_POINTS, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgPolyline(points, fill));
    }

    /** add an {@link svgPolygon} to shapes array @param {svgPolygon} polygon */
    AddPolygon(polygon) { this.svgShapes.push(polygon); }
    AddPolygon(points = DEFAULT_POINTS, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgPolygon(points, fill));
    }

    /** add an {@link svgPath} to shapes array @param {svgPath} path */
    AddPath(path) { this.svgShapes.push(path); }
    AddPath(d = DEFAULT_D, fill = DEFAULT_FILL) {
        this.svgShapes.push(new svgPath(d, fill));
    }

}

class svgViewBox {
    x; y; width; height;
    constructor(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get html() { return `viewBox="${data}"`; }
    get data() { return `${x} ${y} ${width} ${height}`; }
}

// TODO: move svgShape and subclasses to its own script 
// Issue URL: https://github.com/nickyonge/evto-web/issues/44

class svgShape {
    type = null;
    fill = DEFAULT_FILL;
    stroke = DEFAULT_STROKE;// left undefined by default 
    /** Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    extraAttributes;
    constructor(fill = DEFAULT_FILL) { this.fill = fill; }
    get html() {
        if (this.type == null) {
            console.error("ERROR: can't get svgShape of null type, specify shape via subclass, returning null");
            return null;
        }
        return `<${this.type} ${this.data} />`;
    }
    // get data() { return `${fill != null ? ` fill="${fill}"` : ''}${stroke != null ? ` stroke="${stroke}"` : ''}` }
    // get data() { return `${_pd('fill', this.fill)}${_pd('stroke', this.stroke)}` }
    get data() {
        let d = ParseData([
            ['fill', this.fill],
            ['stroke', this.stroke]]);
        // check for and include extraAttributes
        if (this.extraAttributes != null && this.extraAttributes.length > 0) {
            let ea = ParseData(this.extraAttributes);
            if (!isBlank(ea)) { d = `${d} ${ea}`; }
        }
        return d;
    }
}
class svgRect extends svgShape {
    x;
    y;
    width;
    height;
    rx;// left undefined by default 
    ry;// left undefined by default 
    constructor(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'rect';
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get data() {
        // cast this shape's unique properties to data string
        let d = ParseData([
            ['x', this.x],
            ['y', this.y],
            ['width', this.width],
            ['height', this.height],
            ['rx', this.rx],
            ['ry', this.ry]]);
        // combine both this data and superclass data to array, filter null values, join w/ space 
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgCircle extends svgShape {
    r;
    cx;
    cy;
    constructor(r = DEFAULT_R, cx = DEFAULT_CX, cy = DEFAULT_CY, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'circle';
        this.r = r; this.cx = cx; this.cy = cy;
    }
    get data() {
        let d = ParseData([
            ['r', this.r],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgEllipse extends svgShape {
    rx;
    ry;
    cx;
    cy;
    constructor(rx = DEFAULT_RX, ry = DEFAULT_RY, cx = DEFAULT_CX, cy = DEFAULT_CY, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'ellipse';
        this.rx = rx; this.ry = ry; this.cx = cx; this.cy = cy;
    }
    get data() {
        let d = ParseData([
            ['rx', this.rx],
            ['ry', this.ry],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgLine extends svgShape {
    x1;
    y1;
    x2;
    y2;
    constructor(x1 = DEFAULT_X1, y1 = DEFAULT_Y1, x2 = DEFAULT_X2, y2 = DEFAULT_Y2, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'line';
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    }
    get data() {
        let d = ParseData([
            ['x1', this.x1],
            ['y1', this.y1],
            ['x2', this.x2],
            ['y2', this.y2]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgPolyline extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor(points = DEFAULT_POINTS, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'polyline';
        this.points = points;
    }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = ParseData([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgPolygon extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor(points = DEFAULT_POINTS, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'polygon';
        this.points = points;
    }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = ParseData([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}
class svgPath extends svgShape {
    d;
    pathLength;// left undefined by default 
    constructor(d = DEFAULT_D, fill = DEFAULT_FILL) {
        super(fill);
        this.type = 'path';
        this.d = d;
    }
    get data() {
        let d = ParseData([
            ['d', this.d],
            ['pathLength', this.pathLength]]);
        return [d, super.data].filter(Boolean).join(' ');
    }
}

export class svgBox {
    x = DEFAULT_X;
    y = DEFAULT_Y;
    width = DEFAULT_WIDTH;
    height = DEFAULT_HEIGHT;
    fill = DEFAULT_FILL;
    stroke = DEFAULT_STROKE;

    /** 
     * Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    extraAttributes = [];

    constructor(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
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

export function SVGBasicBoxD(x = DEFAULT_X, y = DEFAULT_Y, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT,
    relativeStart = false, closePath = true) {
    return `${relativeStart ? 'm' : 'M'}${x},${y} h${width} v${height} h${-width} ${closePath ? 'Z' : `v${-height}`}`;
}

/**
 * Parse array of data, into HTML-attribute-style `name="value"` format, 
 * with spaces between attributes as needed.
 * @param {Array<[string, any]>} data 2d array of properties, `[name,value]` 
 * @returns {string} data formatted like `first="1" second="2" third="3"`*/
function ParseData(data) {
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
