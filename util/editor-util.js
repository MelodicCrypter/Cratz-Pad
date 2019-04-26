// Utilities for the Editor

// Normalizer for jQuery objects, if prefer dom nodes
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

function mozGetSelections() {
    const winSel = window.getSelection();

    const selections = {
        selectedTexts: winSel.toString(),
        selectedTextsLen: winSel.toString().length,
        textNodeVal: winSel.focusNode.parentElement.nodeName.toString().toLowerCase().trim(),
        addClassToParent: winSel.focusNode.parentElement.classList,
        addIdToParent: winSel.focusNode.parentElement,
        addAttToParent: winSel.focusNode.parentElement,
    };

    return selections;
}

function chromeGetSelections() {
    const winSel = window.getSelection();

    const selections = {
        selectedTexts: winSel.toString(),
        selectedTextsLen: winSel.toString().length,
        parent: winSel.anchorNode.parentElement,
        textNodeVal: winSel.anchorNode.parentElement.nodeName.toString().toLowerCase().trim(),
        addClassToParent: winSel.anchorNode.parentElement.classList,
        addIdToParent: winSel.anchorNode.parentElement,
        addAttToParent: winSel.anchorNode.parentElement,
    };

    return selections;
}

// Menu button enabler
// A jQuery object
function enableMenuButtons(target) {
    if (target.hasClass('disabled')) {
        target.removeClass('disabled');
    }
}

// Menu button disabler
function disableMenuButtons(target) {
    if (!target.hasClass('disabled')) {
        target.addClass('disabled');
    }
}

function textSelExec(target, rangeStart, rangeEnd, textContent) {
    // create a range
    const range = rangeAtIndex(target, rangeStart, rangeEnd);

    // set the range
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // replace the selected texts
    document.execCommand('insertHTML', false, textContent);
}

// snippet by Xeoncross, but modified it a bit
// https://jsfiddle.net/Xeoncross/4tUDk/
function putContentAtCaret(content, rangeStart) {
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
            el.innerHTML = content;
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
        document.selection.createRange().pasteHTML(content);
    }
}

// snippet by TooTallNate,
// https://github.com/webmodules/range-at-index
function rangeAtIndex(el, index, offset, range) {
    const doc = el.ownerDocument;

    if (!range) {
        range = doc.createRange();
    }

    const iterator = doc.createNodeIterator(el, NodeFilter.SHOW_TEXT, null, false);
    const start = {};
    const end = {};
    let len, node, val;

    while (node = iterator.nextNode()) {
        val = node.nodeValue;
        len = val.length;

        if (!start.node && len > index) {
            start.node = node;
            start.offset = index;
        }

        if (!end.node && len >= offset) {
            end.node = node;
            end.offset = offset;
        }

        index -= len;
        offset -= len;
    }

    // update the range with the start and end offsets
    if (start.node) {
        range.setStart(start.node, start.offset);
    }
    if (end.node) {
        range.setEnd(end.node, end.offset);
    }

    return range;
}

// Snipper by Candor, but modified it a bit
// https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container
function proRanger(editor) {
    const getTextSelection = function (editor) {
        const selection = window.getSelection();

        if (selection != null && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            return {
                start: getTextLength(editor, range.startContainer, range.startOffset),
                end: getTextLength(editor, range.endContainer, range.endOffset),
            };
        }

        return null;
    };

    const getTextLength = function (parent, node, offset) {
        let textLength = 0;

        if (node.nodeName == '#text') {
            textLength += offset;
        } else {
            for (let i = 0; i < offset; i++) {
                textLength += getNodeTextLength(node.childNodes[i]);
            }
        }

        if (node != parent) {
            textLength += getTextLength(parent, node.parentNode, getNodeOffset(node));
        }

        return textLength;
    };

    const getNodeTextLength = function (node) {
        let textLength = 0;

        if (node.nodeName == 'BR') {
            textLength = 1;
        } else if (node.nodeName == '#text') {
            textLength = node.nodeValue.length;
        } else if (node.childNodes != null) {
            for (let i = 0; i < node.childNodes.length; i++) {
                textLength += getNodeTextLength(node.childNodes[i]);
            }
        }

        return textLength;
    };

    const getNodeOffset = function (node) {
        return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
    };

    const isEditor = function (element) {
        return element != null && element.classList.contains('editor');
    };

    return {
        start: getTextSelection(document.activeElement).start,
        end: getTextSelection(document.activeElement).end,
    };

    // window.onload = function () {
    //     editor = document.querySelector('.editor');
    //     output = document.querySelector('#output');
    //
    //     document.addEventListener('selectionchange', handleSelectionChange);
    // };
    //
    // const handleSelectionChange = function () {
    //     if (isEditor(document.activeElement)) {
    //         const textSelection = getTextSelection(document.activeElement);
    //
    //         if (textSelection != null) {
    //             const text = document.activeElement.innerText;
    //             const selection = text.slice(textSelection.start, textSelection.end);
    //             print(`Selection: [${selection}] (Start: ${textSelection.start}, End: ${textSelection.end})`);
    //         } else {
    //             print('Selection is null!');
    //         }
    //     } else {
    //         print('Select some text above');
    //     }
    // };

    // const print = function (message) {
    //     if (output != null) {
    //         output.innerText = message;
    //     } else {
    //         console.log('output is null!');
    //     }
    // };
}

// Offical exports
export {
    nodeNormalizer,
    mozGetSelections,
    chromeGetSelections,
    rangeAtIndex,
    enableMenuButtons,
    disableMenuButtons,
    proRanger,
    textSelExec,
};
