export {
    svgElement as element,
    svgHTMLAsset as asset,
    svgViewBox as viewbox
} from './svgElement';

export {
    svgShape as shape,
    svgRect as rect,
    svgCircle as circle,
    svgEllipse as ellipse,
    svgLine as line,
    svgPolyline as polyline,
    svgPolygon as polygon,
    svgPath as path,
    IsValidShapeType
} from './svgShapes';

export { svgGradient as gradient } from './svgGradient';

export * as config from './svgConfig';
export * as default from './svgDefaults';
export * as gen from './svgGenerator';