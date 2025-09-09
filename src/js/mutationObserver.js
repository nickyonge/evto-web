// MutationObserver to track changes to the DOM list

let observer;
let observations = [];

let addNodeCallbacks = [];
let removeNodeCallbacks = [];

export function StartObservation() {
    if (IsObserving()) { return; }
    observer = new MutationObserver(function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // console.log("Node: " + node + ", " + typeof node);
                        // console.log("addnodecallbacks L: " + addNodeCallbacks.length);
                        for (let i = 0; i < addNodeCallbacks.length; i++) {
                            // console.log(addNodeCallbacks[i][0] + ", " + node);
                            // console.log(addNodeCallbacks[i][0]);
                            // console.log(node);
                            // console.log(node.isSameNode(addNodeCallbacks[i][0]));
                            // console.log(node);
                            // console.log(node.contains(addNodeCallbacks[i][0]));
                            // console.log(node == addNodeCallbacks[i][0]);
                            if (addNodeCallbacks[i] &&
                                (addNodeCallbacks[i][0] == node ||
                                    node.contains(addNodeCallbacks[i][0])
                                ) &&
                                addNodeCallbacks[i][1]) {
                                addNodeCallbacks[i][1]();
                            }
                        }
                    }
                });
                mutation.removedNodes.forEach(node => {
                });
                console.log('A child node has been added or removed.');
            } else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    });
}

export function ObserveNode(targetNode, attributes = true, childList = true, subtree = true) {
    if (IsObserving()) {
        if (IsNodeObserved(targetNode)) {
            return;
        }
    } else {
        StartObservation();
    }
    observer.observe(targetNode, { attributes: attributes, childList: childList, subtree: subtree })
    observations.push(targetNode);
}

export function DisconnectObserver() {
    if (!IsObserving()) { return; }
    observer.disconnect();
    observer = null;
}

export function IsObserving() {
    return observer != null;
}

export function IsNodeObserved(targetNode) {
    if (!IsObserving()) { return false; }
    for (let i = 0; i < observations.length; i++) { if (observations[i] == targetNode) { return true; } }
    return false;
}

export function ObserverCallbackOnAdded(targetNode, callback) {
    if (!targetNode || !callback) { return; }
    if (!IsNodeObserved(targetNode)) {
        ObserveNode(targetNode, false, true, false);
    }
    for (let i = 0; i < addNodeCallbacks.length; i++) {
        // ensure callback isn't already added
        if (addNodeCallbacks[i][0] == targetNode &&
            addNodeCallbacks[i][1] == callback) {
            // callback already added
            return;
        }
    }
    console.log("ADDNIG CALLBACK " + callback + " TO NODE " + targetNode);
    addNodeCallbacks.push([targetNode, callback]);
}
export function ObserverCallbackOnRemoved(targetNode, callback) {
    if (!targetNode || !callback) { return; }
    if (!IsNodeObserved(targetNode)) { ObserveNode(targetNode); }
    for (let i = 0; i < removeNodeCallbacks.length; i++) {
        // ensure callback isn't already added
        if (removeNodeCallbacks[i][0] == targetNode &&
            removeNodeCallbacks[i][1] == callback) {
            // callback already added
            return;
        }
    }
    removeNodeCallbacks.push([targetNode, callback]);
}