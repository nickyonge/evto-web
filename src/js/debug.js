import { _env_isProduction } from "./lilutils";

/** 
 * Should Eruda be enabled? 
 * @see https://github.com/liriliri/eruda
 * @type {boolean} 
 */
const ENABLE_ERUDA = true;

/**
 * Launches debugging tools, 
 * such as the Eruda debugger (development mode only) */
export function LaunchDebugging() {

    if (_env_isProduction) {
        return;
    }

    if (ENABLE_ERUDA) {
        import('eruda').then(eruda => { eruda.default.init(); })
    }

}
