import { isStringNotBlank, ReturnStringNotBlank } from "./lilutils";

export function testExport() {
    console.log("testing export");
    console.log(gcs.equator.dotted);

    console.log("creating object");
    let obj = recursiveProxyObject("test", "end", '#');
    console.log("testing:");
    console.log("PROCESSING: " + obj.cookie.chocolatechip.mint);
}

const defaultAssetExtension = '.png';

function Asset(assetFolderReference, assetName, assetExtension = defaultAssetExtension) {
    let assetPath = '';
    switch (assetFolderReference) {
        case 'gcs':
            assetPath = '../../assets/png/map/gcs/gcs-';
            break;
    }
    return `${assetPath}${assetName}${assetExtension}`
}

const gcs = {
    complete: Asset('gcs', 'complete'),
    equator: {
        dotted: Asset('gcs', 'equator_dotted')
    }
}

/**
 * Take symbol values and recursively convert it to a string, or nested object
 * @param {string} [prefix=''] Optional prefix before values  
 * @param {string} [suffix=''] Optional suffix before values 
 * @param {boolean} [returnAsString=true] Return values converted to string? If not, returns directly as object 
 * @param {[string|symbol]} __path Internal reference to recursive path generation. Leave blank 
 * @returns {object|string} New object or string, with recursively-defined values  
 * @example 
 * let myObject = recursiveProxyObject()
 * console.log()
 */
function recursiveProxyObject(prefix = '', suffix = '', separator = '.', returnAsString = true, __path = []) {
    return new Proxy({}, {
        get(_, property) {
            // porperty type conversion, check to return final output 
            if (property === Symbol.toPrimitive || property === 'toString' || property === 'valueOf') {
                const result = `${ReturnStringNotBlank(prefix,null,separator)}${__path.join(separator)}${ReturnStringNotBlank(suffix,separator)}`;
                return () => (returnAsString ? String(result) : result);
            }
            return recursiveProxyObject(prefix, suffix, separator, returnAsString, [...__path, property]);
        }
    });
}

/*

export {
    'gcs-complete.png',
    'gcs-equator_dotted.png',
    'gcs-equator_solid.png',
    'gcs-equator_tropics_polar_circles.png',
    'gcs-latitude_with_dotted_equator.png',
    'gcs-latitude_with_tropics_and_polar_circles.png',
    'gcs-latitude.png',
    'gcs-latlong_15deg_dotted.png',
    'gcs-latlong_30deg_dotted.png',
    'gcs-latlong_with_dotted_equator_meridians.png',
    'gcs-latlong.png',
    'gcs-longitude_with_dotted_meridians.png',
    'gcs-longitude.png',
    'gcs-polar_circles.png',
    'gcs-tropics_and_polar_circles.png',
    'gcs-tropics.png'
} from '../../assets/png/map/gcs/';

export {
    'label-gcs_equator',
    'label-gcs_latitude_15deg',
    'label-gcs_latitude_30deg',
    'label-gcs_latlong_15deg',
    'label-gcs_latlong_30deg',
    'label-gcs_longitude_15deg',
    'label-gcs_longitude_30deg',
    'label-gcs_meridian_antimeridian',
    'label-gcs_meridian_full',
    'label-gcs_meridian_primemeridian',
    'label-gcs_polarcircle_antarctic',
    'label-gcs_polarcircle_arctic',
    'label-gcs_polarcircle_full',
    'label-gcs_poles_full',
    'label-gcs_poles_north',
    'label-gcs_poles_south',
    'label-gcs_tropic_cancer',
    'label-gcs_tropic_capricorn',
    'label-gcs_tropic_full',
    'label-land_large',
    'label-land_normalized',
    'label-land_relative'
} from '../../assets/png/map/land/labels';

export {
    'land-d1major_fill.png',
    'land-d2minor_fill.png',
    'land-d3tiny_fill.png',
    'land-d1major_stroke.png',
    'land-d2minor_stroke.png',
    'land-d3tiny_stroke.png'
} from '../../assets/png/map/land/';

export {
    'line-horz_d1major.png',
    'line-horz_d2minor.png',
    'line-horz_d3tiny.png',
    'line-lat_d1major.png',
    'line-lat_d2minor.png',
    'line-lat_d3tiny.png',
    'line-long_d1major.png',
    'line-long_d2minor.png',
    'line-long_d3tiny.png',
    'line-vert_d1major.png',
    'line-vert_d2minor.png',
    'line-vert_d3tiny.png'
} from '../../assets/png/map/landlines/';

export {

    'border_combined/titlebox_frame_combined_duck_shadow_alt.png',
    'border_combined/titlebox_frame_combined_duck_shadow.png',
    'border_combined/titlebox_frame_combined_duck.png',
    'border_combined/titlebox_frame_combined_picframe_shadow.png',
    'border_combined/titlebox_frame_combined_picframe.png',
    'border_combined/titlebox_frame_combined_rounded_shadow.png',
    'border_combined/titlebox_frame_combined_rounded.png',
    'border_combined/titlebox_frame_combined_square_shadow.png',
    'border_combined/titlebox_frame_combined_square.png',

    'border_fill/titlebox_frame_fill_duck_merged_alt.png',
    'border_fill/titlebox_frame_fill_duck_merged.png',
    'border_fill/titlebox_frame_fill_duck_shadow_alt.png',
    'border_fill/titlebox_frame_fill_duck_shadow.png',
    'border_fill/titlebox_frame_fill_duck.png',
    'border_fill/titlebox_frame_fill_picframe_merged.png',
    'border_fill/titlebox_frame_fill_picframe_shadow.png',
    'border_fill/titlebox_frame_fill_picframe.png',
    'border_fill/titlebox_frame_fill_rounded_merged.png',
    'border_fill/titlebox_frame_fill_rounded_shadow.png',
    'border_fill/titlebox_frame_fill_rounded.png',
    'border_fill/titlebox_frame_fill_square_merged.png',
    'border_fill/titlebox_frame_fill_square_shadow.png',
    'border_fill/titlebox_frame_fill_square.png',

    'border_stroke_black/titlebox_frame_stroke_duck_shadow_alt.png',
    'border_stroke_black/titlebox_frame_stroke_duck_shadow.png',
    'border_stroke_black/titlebox_frame_stroke_duck.png',
    'border_stroke_black/titlebox_frame_stroke_picframe_shadow.png',
    'border_stroke_black/titlebox_frame_stroke_picframe.png',
    'border_stroke_black/titlebox_frame_stroke_rounded_shadow.png',
    'border_stroke_black/titlebox_frame_stroke_rounded.png',
    'border_stroke_black/titlebox_frame_stroke_square_shadow.png',
    'border_stroke_black/titlebox_frame_stroke_square.png',

    'border_stroke_white/titlebox_frame_stroke_duck_shadow_alt.png',
    'border_stroke_white/titlebox_frame_stroke_duck_shadow.png',
    'border_stroke_white/titlebox_frame_stroke_duck.png',
    'border_stroke_white/titlebox_frame_stroke_picframe_shadow.png',
    'border_stroke_white/titlebox_frame_stroke_picframe.png',
    'border_stroke_white/titlebox_frame_stroke_rounded_shadow.png',
    'border_stroke_white/titlebox_frame_stroke_rounded.png',
    'border_stroke_white/titlebox_frame_stroke_square_shadow.png',
    'border_stroke_white/titlebox_frame_stroke_square.png',

    'text_black/titlebox-text_body.png',
    'text_black/titlebox-text_full.png',
    'text_black/titlebox-text_title.png',

    'text_white/titlebox-text_body.png',
    'text_white/titlebox-text_full.png',
    'text_white/titlebox-text_title.png'

} from '../../assets/png/map/titlebox/';
*/