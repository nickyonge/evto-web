// MutationObserver to track changes to the DOM list

let observer;
let observations = [];


export function StartObservation() {
    if (IsObserving()) { return; }
    observer = new MutationObserver(function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
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