import * as svg from './index';
import { ParseData } from './svgGenerator';

export class svgShape {
    type = null;
    fill = svg.default.DEFAULT_FILL;
    stroke = svg.default.DEFAULT_STROKE;// left undefined by default 
    /** Additional attributes to include in the path, 
     * in a 2D string array `[ [attr, value], ... ]`
     * @type {Array<[string, any]>} */
    extraAttributes;
    constructor(fill = svg.default.DEFAULT_FILL) { this.fill = fill; }
    get html() {
        if (this.type == null) {
            console.error("ERROR: can't get svgShape of null type, specify shape via subclass, returning null");
            return null;
        }
        return `<${this.type} ${this.data}/>`;
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
export class svgRect extends svgShape {
    x;
    y;
    width;
    height;
    rx;// left undefined by default 
    ry;// left undefined by default 
    constructor(x = svg.default.DEFAULT_X, y = svg.default.DEFAULT_Y, width = svg.default.DEFAULT_WIDTH, height = svg.default.DEFAULT_HEIGHT, fill = svg.default.DEFAULT_FILL) {
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
export class svgCircle extends svgShape {
    r;
    cx;
    cy;
    constructor(r = svg.default.DEFAULT_R, cx = svg.default.DEFAULT_CX, cy = svg.default.DEFAULT_CY, fill = svg.default.DEFAULT_FILL) {
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
export class svgEllipse extends svgShape {
    rx;
    ry;
    cx;
    cy;
    constructor(rx = svg.default.DEFAULT_RX, ry = svg.default.DEFAULT_RY, cx = svg.default.DEFAULT_CX, cy = svg.default.DEFAULT_CY, fill = svg.default.DEFAULT_FILL) {
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
export class svgLine extends svgShape {
    x1;
    y1;
    x2;
    y2;
    constructor(x1 = svg.default.DEFAULT_X1, y1 = svg.default.DEFAULT_Y1, x2 = svg.default.DEFAULT_X2, y2 = svg.default.DEFAULT_Y2, fill = svg.default.DEFAULT_FILL) {
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
export class svgPolyline extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor(points = svg.default.DEFAULT_POINTS, fill = svg.default.DEFAULT_FILL) {
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
export class svgPolygon extends svgShape {
    /** 2D array of numeric points, `[ [x, y], [x, y], ... ]` @type {[number,number]} */
    points;
    constructor(points = svg.default.DEFAULT_POINTS, fill = svg.default.DEFAULT_FILL) {
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
export class svgPath extends svgShape {
    d;
    pathLength;// left undefined by default 
    constructor(d = svg.default.DEFAULT_D, fill = svg.default.DEFAULT_FILL) {
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