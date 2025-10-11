//@ts-check

// script for document-level architecture 
import { BasicComponent } from "./components/base";

/** @type {<T extends Node>(Node: T) => Node} */
const _appendChild = Node.prototype.appendChild;

/**
 * Calls the function with the specified object as the this 
 * value and the specified rest arguments as the arguments.
 * @param {Node} childNode
 * @override Node.prototype.appendChild This overrides 
 * {@linkcode Node.prototype.appendChild appendChild} to 
 * allow directly adding {@linkcode BasicComponent} classes.
 */
Node.prototype.appendChild = function (childNode) {
    // if (this.nodeType === 1 && /** @type {Element} */ (this).tagName === 'DIV') {
    //     console.log('Custom appendChild called for a DIV!');
    // }

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