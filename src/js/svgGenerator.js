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

export class svgAsset {
    class;
    id;
    definitions;
    preserveAspectRatio;
    viewBox = {
        x: SVG_DEFAULT_X, y: SVG_DEFAULT_Y, width: SVG_DEFAULT_WIDTH, height: SVG_DEFAULT_HEIGHT,
        get html() { return `viewBow="${data}"`; },
        get data() { return `${x} ${y} ${width} ${height}`; }
    }
    shapes;
}

class svgShape {
    type = null;
    fill = SVG_DEFAULT_FILL;
    stroke = SVG_DEFAULT_STROKE;
    /** Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<string[]>} */
    extraAttributes;
    constructor() { }
    get html() {
        if (this.type == null) {
            console.error("ERROR: can't get svgShape of null type, specify shape via subclass, returning null");
            return null;
        }
        return `<${this.type} ${this.data} />`;
    }
    // get data() { return `${fill != null ? ` fill="${fill}"` : ''}${stroke != null ? ` stroke="${stroke}"` : ''}` }
    // get data() { return `${this._pd('fill', this.fill)}${this._pd('stroke', this.stroke)}` }
    get data() {
        return this._parse([
            ['fill', this.fill],
            ['stroke', this.stroke]]);
    }
    /**
     * 
     * @param {Array<[string, ...any]>} data 2d array of properties, `[name,value]` 
     * @returns {string|null} */
    _parse(data) {
        let d = [];
        data.forEach(datum => {
            let out = this._pd(datum[0], datum[1]);
            if (out != null) { d.push(out); }
        });
        return d.join(' ');
    }
    /** Parse individual property data for use as an SVG attribute
     * @param {string} name 
     * @param {*} value 
     * @returns {string|null} */
    _pd(name, value) { return `${value != null ? ` ${name}="${value}"` : ''}`; }
}
class svgRect extends svgShape {
    x; y; width; height;
    constructor() { super(); this.type = 'rect'; }
    get data() {
        // cast this shape's unique properties to data string
        let d = this._parse([
            ['x', this.x],
            ['y', this.y],
            ['width', this.width],
            ['height', this.height]]);
        // combine both this data and superclass data to array, filter null values, join w/ space 
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgCircle extends svgShape {
    r; cx; cy;
    constructor() { super(); this.type = 'circle'; }
    get data() {
        let d = this._parse([
            ['r', this.r],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgEllipse extends svgShape {
    rx; ry; cx; cy;
    constructor() { super(); this.type = 'ellipse'; }
    get data() {
        let d = this._parse([
            ['rx', this.rx],
            ['ry', this.ry],
            ['cx', this.cx],
            ['cy', this.cy]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgLine extends svgShape {
    x1; y1; x2; y2;
    constructor() { super(); this.type = 'line'; }
    get data() {
        let d = this._parse([
            ['x1', this.x1],
            ['y1', this.y1],
            ['x2', this.x2],
            ['y2', this.y2]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgPolyline extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor() { super(); this.type = 'polyline'; }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = this._parse([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgPolygon extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor() { super(); this.type = 'polygon'; }
    get data() {
        let pts = [];
        if (this.points != null) {
            this.points.forEach(pt => { pts.push(pt.join(',')); });
        }
        let d = this._parse([['points', pts.length > 0 ? pts.join(' ') : null]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}
class svgPath {
    d;
    pathLength;
    constructor() { super(); this.type = 'path'; }
    get data() {
        let d = this._parse([
            ['d', this.d],
            ['pathLength', this.pathLength]]);
        return [d, super.data()].filter(Boolean).join(' ');
    }
}

export class svgBox {
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