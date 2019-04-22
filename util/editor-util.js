// Utilities for the Editor

// Normalizer for jQuery objects, prefer dom nodes
function nodeNormalizer(target) {
    let domTarget = target;

    // if jQuery convert to dom node
    if (target instanceof jQuery) {
        domTarget = target.get(0);
    }

    return domTarget;
}

// Used for reloading or refreshing an element's contents
// e.g, when the user clicks an emoji, the textarea would refresh automatically
function reloadContent(target, newContent) {
    // Convert jquery to a dom node
    const domTarget = nodeNormalizer(target);

    // If there's no new content, just copy target's original data
    if (!newContent) {
        domTarget.innerHTML = target.innerHTML;
    } else {
        domTarget.innerHTML = newContent;
    }
}

function selectionIsBold() {
    let isBold = false;

    if (document.queryCommandState) {
        isBold = document.queryCommandState('bold');
    }

    return isBold;
}

export {
    reloadContent,
    selectionIsBold,
    nodeNormalizer,
};
