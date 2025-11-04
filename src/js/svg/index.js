import { svgElement } from './svgElement';

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
export * as defaults from './svgDefaults';
export * as generator from './svgGenerator';

/**
 * Callback for when a value in an {@link svgElement} has changed
 * @callback onChange
 * @param {string} valueChanged The name of the value that was changed 
 * @param {any} newValue The newly assigned value 
 * @param {any} previousValue The old value, for reference  
 * @param {svgElement} [changedElement=undefined] The {@link svgElement} that was changed 
 * @returns {void}
 */
