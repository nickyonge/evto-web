import { EnsureGradientDefaultColors } from "./svgDefaults";
import { svgElement, svgHTMLAsset } from "./svgElement";
import { svgShape } from "./svgShapes";

/**
 * Are unique IDs on {@link svgElement svgElements} REQUIRED? 
 * If `true`, already-used IDs will not be permitted. If `false`,
 * they will still produce a warning. IDs that are `null` are ignored.
 * @returns {boolean}
 */
export const REQUIRE_UNIQUE_SVG_ELEMENT_IDS = true;

/**
 * Should {@link svgElement} HTML code contain 
 * `\n` newlines for each element?
 * @returns {boolean} 
 */
export const HTML_NEWLINE = true;
/** 
 * Should {@link svgElement} HTML code be `\t` indented? 
 * @see {@linkcode HTML_NEWLINE} must also be `true`.
 * @returns {boolean}
 * */
export const HTML_INDENT = true && HTML_NEWLINE;
/** 
 * Should {@link svgHTMLAsset} HTML generation warn if it 
 * finds any {@link svgHTMLAsset.definitions definitions}
 * that do not have an {@link svgElement.id ID}?
 * @returns {boolean}
 */
export const HTML_WARN_DEFS_NO_ID = true;

/**
 * Does setting {@linkcode svgHTMLAsset.gradient} to `null`
 * also set {@linkcode svgShape.fill} to `null` for any
 * {@link svgHTMLAsset.shapes shapes} on that
 * {@link svgHTMLAsset asset} using the existing gradient?
 */
export const SET_GRADIENT_NULL_SETS_FILL_NULL = true;

/**
 * Should {@linkcode EnsureGradientDefaultColors}
 * force a single color array to add a second value?
 * @returns {boolean}
 */
export const DEFAULT_COLORARRAY_FORCE_TWO_VALUES = false;

/**
 * Class constructor names to NOT auto-add an ID to in {@link svgElement}
 * @returns {string[]}
 */
export const IGNORE_AUTO_ID_CLASSES = [
    // 'svgGradientStop'
];
