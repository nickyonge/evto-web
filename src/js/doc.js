// script for document-level architecture 
import { BasicComponent } from "./components/base";

const _appendChild = Element.prototype.appendChild;

/** appendChild override, accommodating BasicComponent internal div property */
Element.prototype.appendChild = function (childNode) {
    if (this.tagName === 'DIV') { // Apply custom logic only for div elements
        // console.log('Custom appendChild called for a DIV!');
        // Custom logic for DIVs
    }

    // if appending a BasicComponent directly, add its div
    if (typeof childNode === 'object' &&
        childNode instanceof BasicComponent) {
        return _appendChild.call(this, childNode.div);
    }
    // original method
    return _appendChild.call(this, childNode);
};

Number.prototype.toMax = function (maxDecimals = 3) {
    const str = this.valueOf().toFixed(maxDecimals);
    return String(Number(str));
};