import { EnsureGradientDefaultColors } from "./svgDefaults";
import { svgElement, svgHTMLAsset } from "./svgElement";

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
 * Should {@linkcode EnsureGradientDefaultColors}
 * force a single color array to add a second value?
 * @returns {boolean}
 */
export const DEFAULT_COLORARRAY_FORCE_TWO_VALUES = false;