// Utilities for Caret or cursor

// Get the caret position
function getCaretPos(target) {
    const isContentEditable = target && target.contentEditable;

    // ContentEditable
    if (isContentEditable) {
        target.focus();
        const _range = document.getSelection().getRangeAt(0);
        const range = _range.cloneRange();
        range.selectNodeContents(target);
        range.setEnd(_range.endContainer, _range.endOffset);

        return range.toString().length;
    }

    // Textareas or Inputs
    return target.selectionStart;
}

// Snippet by ..., but modified a bit, to pur cursor at the end of texts
function putCursorAtEnd(target) {
    const textNode = target.lastChild;
    const caret = textNode.length;
    const range = document.createRange();
    const sel = window.getSelection();

    target.focus();

    range.setStart(textNode, caret);
    range.setEnd(textNode, caret);

    sel.removeAllRanges();
    sel.addRange(range);
}

// snippet by Liam
// (https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div)
function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange();
        range.selectNode(node);
        range.setStart(node, 0);
    }

    if (chars.count === 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars.count -= node.textContent.length;
            } else {
                range.setEnd(node, chars.count);
                chars.count = 0;
            }
        } else {
            for (let lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                    break;
                }
            }
        }
    }
    return range;
}

// snippet by Liam, but modified it, same link above
function setCaretPos(target, pos) {
    if (pos >= 0) {
        const selection = document.getSelection();
        const range = createRange(target, { count: `${pos}` });

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

export {
    getCaretPos,
    setCaretPos,
    putCursorAtEnd,
    createRange,
};
