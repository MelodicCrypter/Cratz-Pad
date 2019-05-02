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
        textNodeParentVal: winSel.focusNode.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeGrandParentVal: winSel.focusNode.parentElement.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
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
        textNodeParentVal: winSel.anchorNode.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeGrandParentVal: winSel.anchorNode.parentElement.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeGrandGrandParentVal: winSel.anchorNode.parentElement.parentElement.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        addClassToParent: winSel.anchorNode.parentElement.classList.add,
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

/**
 * This will fire up when the user clicks the buttons: B, I, U
 *
 * @param o             this is the options object
 * rangeStart,          the start of the range
 * rangeEnd,            the end of the range
 * target: textarea,    the dom element
 * content: winSel.selectedTexts,   the selected texts
 * tag: winSel.textNodeVal,         the firstChild tag, e.g <i> etc
 * tagParent: winSel.textNodeParentVal,     the Parent tag
 * tagGrandParent: winSel.textNodeGrandParentVal,   the Grand parent tag
 * newTag: 'strong',    the new tag that you wish to apply
 *
 * basically, the pattern here would be always
 * <strong><i><u> content </u></i></strong>
 * it will never change. Even if strong was clicked last, it will still be
 * formatted like that.
 *
 * So, <grandParent><parent><tag> content </tag></parent></grandParent>
 */
function textSelExecFontStyle(o) {
    let newContent;

    // create a range
    const range = rangeAtIndex(o.target, o.rangeStart, o.rangeEnd);

    // set the range
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    if (o.tagGrandParent === 'strong' && o.tagParent === 'i' && o.tag === 'u') {
        if (o.newTag === 'strong') {
            newContent = `<i><u>${o.content}</u></i>`;
        }

        if (o.newTag === 'em') {
            newContent = `<strong><u>${o.content}</u></strong>`;
        }

        if (o.newTag === 'u') {
            newContent = `<strong><i>${o.content}</i></strong>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'pre' && o.tagParent === 'i') {
        if (o.tag === 'u' && o.newTag === 'strong') {
            newContent = `<strong><i><u>${o.content}</u></i></strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'u') {
            newContent = `<i>${o.content}</i>`;
        }

        if (o.tagParent === o.newTag) {
            newContent = `<${o.tag}>${o.content}</${o.tag}>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'pre' && o.tagParent === 'strong') {
        if (o.tag === 'u' && o.newTag === 'i') {
            newContent = `<strong><i><u>${o.content}</u></i></strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'u') {
            newContent = `<strong>${o.content}</strong>`;
        }

        if (o.tag === 'i' && o.newTag === 'u') {
            newContent = `<strong><i><u>${o.content}</u></i></strong>`;
        }

        if (o.tag === 'i' && o.newTag === 'i') {
            newContent = `<strong>${o.content}</strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'strong') {
            newContent = `<u>${o.content}</u>`;
        }

        if (o.tag === 'i' && o.newTag === 'strong') {
            newContent = `<i>${o.content}</i>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandestParent === 'main' && o.tagGrandParent === 'section' && o.tagParent === 'pre' && o.tag === 'u') {
        if (o.newTag === 'strong') {
            newContent = `<strong><u>${o.content}</u></strong>`;
        }

        if (o.newTag === 'i') {
            newContent = `<i><u>${o.content}</u></i>`;
        }

        if (o.newTag === o.tag) {
            newContent = `${o.content}`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandestParent === 'main' && o.tagGrandParent === 'section' && o.tagParent === 'pre' && o.tag === 'i') {
        if (o.newTag === 'strong') {
            newContent = `<strong><i>${o.content}</i></strong>`;
        }

        if (o.newTag === 'u') {
            newContent = `<i><u>${o.content}</u></i>`;
        }

        if (o.newTag === o.tag) {
            newContent = `${o.content}`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandestParent === 'main' && o.tagGrandParent === 'section' && o.tagParent === 'pre' && o.tag === 'strong') {
        if (o.newTag === 'i') {
            newContent = `<strong><i>${o.content}</i></strong>`;
        }

        if (o.newTag === 'u') {
            newContent = `<strong><u>${o.content}</u></strong>`;
        }

        if (o.newTag === 'strong') {
            newContent = `${o.content}`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.newTag === 'align-all-left' || o.newTag === 'align-all-center' || o.newTag === 'align-all-right' || o.newTag === 'align-all-justify') {
        if (o.contentLen === o.textOverallLen) {
            const preSelectors = document.querySelectorAll('pre');

            preSelectors.forEach((pre) => {
                pre.className = '';
                pre.classList.add(o.newTag);
            });
        } else {
            o.nodeParent.closest('pre').className = '';
            o.nodeParent.closest('pre').classList.add(o.newTag);
        }
    } else if (o.tagGrandestParent === 'div' && o.tagGrandParent === 'main' && o.tagParent === 'section' && o.tag === 'pre') {
        // mostly the o.tag here is 'div', it means the text/s has no tags yet
        // basing on the pattern mentioned above, it should be
        // grandParent then parent then tag, so div would always be first tag
        newContent = `<${o.newTag}>${o.content}</${o.newTag}>`;

        // replace the selected texts with its corresponding tags
        document.execCommand('delete', false, null);
        document.execCommand('insertHTML', false, newContent);
        // o.nodeParent.closest('pre').innerHTML += newContent;
    }
}


function textSelExecBold(o) {
    let newContent;

    // create a range
    const range = rangeAtIndex(o.target, o.rangeStart, o.rangeEnd);

    // set the range
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // if (o.tag === 'b') {
    //     newContent = `${o.content}`;
    //
    //     // replace the selected texts
    //     document.execCommand('insertHTML', false, newContent);
    // } else {
    //     newContent = `<b>${o.content}</b>`;
    //
    //     // replace the selected texts
    //     document.execCommand('insertHTML', false, newContent);
    // }
    o.tag.closest(strong);
}

function textSelExecAlign(o) {
    // create a range
    const range = rangeAtIndex(o.target, o.rangeStart, o.rangeEnd);

    // set the range
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    document.execCommand(o.newTag, false, null);
}

function validateSelStr(tests, subject, passStat) {
    const testsArr = [...tests];
    const res = [];

    // Run all tests
    testsArr.forEach((test) => {
        if (test === 'hasLength') {
            subject.length > 0 ? res.push(true) : res.push(false);
        }
        if (test === 'isString') {
            typeof subject === 'string' ? res.push(true) : res.push(false);
        }
        if (test === 'emptyString') {
            subject === '' ? res.push(true) : res.push(false);
        }
        if (test === 'undefined') {
            subject === undefined ? res.push(true) : res.push(false);
        }
    });

    // Check if passStat is set to 'all', meaning all tests must pass
    if (passStat === 'all' && res.length > 0) {
        return res.every(r => r === true);
    }

    // Check if passStat is set to 'notAll', meaning only one or several tests should pass
    if (passStat === 'notAll' && res.length > 0) {
        return res.some(r => r === true);
    }

    // if res is empty just return false
    return false;
}

function validateSelStrIfNot(tests, subject, passStat) {
    const testsArr = [...tests];
    const res = [];

    // Run all tests
    testsArr.forEach((test) => {
        if (test === 'emptyString') {
            subject !== '' ? res.push(true) : res.push(false);
        }
        if (test === 'undefined') {
            subject !== 'string' ? res.push(true) : res.push(false);
        }
    });

    // Check res if all are true, meaning all tests past
    if (res.length > 0) {
        return res.every(r => r === true);
    }

    // if res is empty just return false
    return false;
}

function modalShowMod(targetModal, targetParent, modalBody, textMsg) {
    targetParent.addClass('modal-lg');
    modalBody.addClass('modal-modified');
    modalBody.html(textMsg);
    targetModal.modal('show');

    targetModal.on('hidden.bs.modal', (e) => {
        targetParent.removeClass('modal-lg');
        modalBody.removeClass('modal-modified');
    });
}

function modalShow(targetModal, modalBody, textMsg) {
    modalBody.text(textMsg);
    targetModal.modal('show');
}

function downloader(filename, data) {
    const target = document.createElement('a');
    target.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
    target.setAttribute('download', filename);
    target.style.display = 'none';
    document.body.appendChild(target);
    target.click();
    document.body.removeChild(target);
}

// snippet by Stefan Steiger
// https://stackoverflow.com/questions/17278770/how-do-i-detect-chromium-specifically-vs-chrome
function isChromium() {
    for (let i = 0, u = 'Chromium', l = u.length; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i].name != null && navigator.plugins[i].name.substr(0, l) === u) {
            return true;
        }
    }

    return false;
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
    textSelExecFontStyle,
    textSelExecBold,
    validateSelStr,
    modalShow,
    modalShowMod,
    downloader,
    textSelExecAlign,
    validateSelStrIfNot,
};
