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

function getSelections() {
    const winSel = window.getSelection();

    const selections = {
        selectedTexts: winSel.toString(),
        selectedTextsLen: winSel.toString().length,
        textNodeVal: winSel.focusNode.parentElement.nodeName.toString().toLowerCase().trim(),
        addClassToParent: winSel.focusNode.parentElement.parentElement.classList,
        addIdToParent: winSel.focusNode.parentElement,
        addAttToParent: winSel.focusNode.parentElement,
    };

    return selections;
}

// snippet by Xeoncross, but modified a bit
// https://jsfiddle.net/Xeoncross/4tUDk/
function putContentAtCaret(html) {
    let range, sel;

    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            const el = document.createElement('div');
            el.innerHTML = html;
            const frag = document.createDocumentFragment();
            let node;
            let lastNode;

            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type !== 'Control') {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function selectionIsBold() {
    let isBold = false;

    if (document.queryCommandState) {
        isBold = document.queryCommandState('bold');
    }

    return isBold;
}

function toBold(target, selectedTexts) {
    const boldTexts = `<span class="bold">${selectedTexts}</span>`;

    target.html((index, text) => text.replace(selectedTexts, boldTexts));
}

function deBold(target, selectedTexts) {
    const deBoldTexts = `<span class="debold">${selectedTexts}</span>`;

    target.html((index, text) => text.replace(selectedTexts, deBoldTexts));
}

export {
    reloadContent,
    selectionIsBold,
    nodeNormalizer,
    getSelections,
    toBold,
    deBold,
    putContentAtCaret,
};
