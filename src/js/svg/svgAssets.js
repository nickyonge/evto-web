import * as svg from './index';
import { shape, rect, circle, ellipse, line, polyline, polygon, path } from "./index";
import { ParseData } from "./svgGenerator";
import { isBlank } from "../lilutils";

const SVG_HTML_NEWLINE = true;
const SVG_HTML_INDENT = true;

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
        this.metadata = svg.default.SVG_METADATA;
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
        if (this.metadata == null) { this.metadata = svg.default.SVG_METADATA; }
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
    AddShape(fill = svg.default.FILL) { this.svgShapes.push(new shape(fill)); }

    /** add an {@link svg.rect} to shapes array @param {svg.rect} rect */
    AddRect(rect) { this.svgShapes.push(rect); }
    AddRect(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT, fill = svg.default.FILL) {
        this.svgShapes.push(new rect(x, y, width, height, fill));
    }

    /** add an {@link svg.circle} to shapes array @param {circle} circle */
    AddCircle(circle) { this.svgShapes.push(circle); }
    AddCircle(r = svg.default.R, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        this.svgShapes.push(new circle(r, cx, cy, fill));
    }

    /** add an {@link svg.ellipse} to shapes array @param {ellipse} ellipse */
    AddEllipse(ellipse) { this.svgShapes.push(ellipse); }
    AddEllipse(rx = svg.default.ELLIPSE_RX, ry = svg.default.ELLIPSE_RY, cx = svg.default.CX, cy = svg.default.CY, fill = svg.default.FILL) {
        this.svgShapes.push(new ellipse(rx, ry, cx, cy, fill));
    }

    /** add an {@link svg.line} to shapes array @param {line} line */
    AddLine(line) { this.svgShapes.push(line); }
    AddLine(x1 = svg.default.X1, y1 = svg.default.Y1, x2 = svg.default.X2, y2 = svg.default.Y2, fill = svg.default.FILL) {
        this.svgShapes.push(new line(x1, y1, x2, y2, fill));
    }

    /** add an {@link svg.polyline} to shapes array @param {polyline} polyline */
    AddPolyline(polyline) { this.svgShapes.push(polyline); }
    AddPolyline(points = svg.default.POINTS, fill = svg.default.FILL) {
        this.svgShapes.push(new polyline(points, fill));
    }

    /** add an {@link svg.polygon} to shapes array @param {polygon} polygon */
    AddPolygon(polygon) { this.svgShapes.push(polygon); }
    AddPolygon(points = svg.default.POINTS, fill = svg.default.FILL) {
        this.svgShapes.push(new polygon(points, fill));
    }

    /** add an {@link svg.path} to shapes array @param {path} path */
    AddPath(path) { this.svgShapes.push(path); }
    AddPath(d = svg.default.D, fill = svg.default.FILL) {
        this.svgShapes.push(new path(d, fill));
    }

}

export class svgViewBox {
    x; y; width; height;
    constructor(x = svg.default.X, y = svg.default.Y, width = svg.default.WIDTH, height = svg.default.HEIGHT) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    }
    get html() { return `viewBox="${this.data}"`; }
    get data() { return `${this.x} ${this.y} ${this.width} ${this.height}`; }
}