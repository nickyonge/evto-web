import { svgElement, svgHTMLAsset } from "./svgElement";

/**
 * Should {@link svgElement} HTML code contain 
 * `\n` newlines for each element?
 * @type {boolean} 
 */
export const HTML_NEWLINE = true;
/** 
 * Should {@link svgElement} HTML code be `\t` indented? 
 * @see {@linkcode HTML_NEWLINE} must also be `true`.
 * @type {boolean}
 * */
export const HTML_INDENT = true && HTML_NEWLINE;
/** 
 * Should {@link svgHTMLAsset} HTML generation warn if it 
 * finds any {@link svgHTMLAsset.definitions definitions}
 * that do not have an {@link svgElement.id ID}?
 * @type {boolean}
 */
export const HTML_WARN_DEFS_NO_ID = true;