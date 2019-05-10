// Utilities for the Editor

import ls from 'local-storage';

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
        parent: winSel.focusNode.parentElement,
        textNodeVal: winSel.focusNode.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeParentVal: winSel.focusNode.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeGrandParentVal: winSel.focusNode.parentElement.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        textNodeGrandGrandParentVal: winSel.focusNode.parentElement.parentElement.parentElement.parentElement.nodeName.toString().toLowerCase().trim(),
        addClassToParent: winSel.focusNode.parentElement.classList.add,
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
 * tag: winSel.textNodeVal,         the firstChild tag, e.g <em> etc
 * tagParent: winSel.textNodeParentVal,     the Parent tag
 * tagGrandParent: winSel.textNodeGrandParentVal,   the Grand parent tag
 * newTag: 'strong',    the new tag that you wish to apply
 *
 * basically, the pattern here would be always
 * <strong><em><u> content </u></em></strong>
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
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    if (o.tagGrandParent === 'strong' && o.tagParent === 'em' && o.tag === 'u') {
        if (o.newTag === 'strong') {
            newContent = `<em><u>${o.content}</u></em>`;
        }

        if (o.newTag === 'em') {
            newContent = `<strong><u>${o.content}</u></strong>`;
        }

        if (o.newTag === 'u') {
            newContent = `<strong><em>${o.content}</em></strong>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'section' && o.tagParent === 'em') {
        if (o.tag === 'u' && o.newTag === 'strong') {
            newContent = `<strong><em><u>${o.content}</u></em></strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'u') {
            newContent = `<em>${o.content}</em>`;
        }

        if (o.tagParent === o.newTag) {
            newContent = `<${o.tag}>${o.content}</${o.tag}>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'section' && o.tagParent === 'strong') {
        if (o.tag === 'u' && o.newTag === 'em') {
            newContent = `<strong><em><u>${o.content}</u></em></strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'u') {
            newContent = `<strong>${o.content}</strong>`;
        }

        if (o.tag === 'em' && o.newTag === 'u') {
            newContent = `<strong><em><u>${o.content}</u></em></strong>`;
        }

        if (o.tag === 'em' && o.newTag === 'em') {
            newContent = `<strong>${o.content}</strong>`;
        }

        if (o.tag === 'u' && o.newTag === 'strong') {
            newContent = `<u>${o.content}</u>`;
        }

        if (o.tag === 'em' && o.newTag === 'strong') {
            newContent = `<em>${o.content}</em>`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'main' && o.tagParent === 'section' && o.tag === 'u') {
        if (o.newTag === 'strong') {
            newContent = `<strong><u>${o.content}</u></strong>`;
        }

        if (o.newTag === 'em') {
            newContent = `<em><u>${o.content}</u></em>`;
        }

        if (o.newTag === o.tag) {
            newContent = `${o.content}`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'main' && o.tagParent === 'section' && o.tag === 'em') {
        if (o.newTag === 'strong') {
            newContent = `<strong><em>${o.content}</em></strong>`;
        }

        if (o.newTag === 'u') {
            newContent = `<em><u>${o.content}</u></em>`;
        }

        if (o.newTag === o.tag) {
            newContent = `${o.content}`;
        }

        // replace the selected texts
        document.execCommand('insertHTML', false, newContent);
    } else if (o.tagGrandParent === 'main' && o.tagParent === 'section' && o.tag === 'strong') {
        if (o.newTag === 'em') {
            newContent = `<strong><em>${o.content}</em></strong>`;
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
        const alignments = ['align-all-left', 'align-all-center', 'align-all-right', 'align-all-justify'];

        alignments.forEach((a) => {
            o.target.classList.remove(a.toString());
        });

        o.target.classList.add(o.newTag);
        o.target.focus();

        ls.remove('textareaAlignment');
        ls.set('textareaAlignment', o.newTag);
    } else if (o.tagGrandParent === 'div' && o.tagParent === 'main' && o.tag === 'section') {
        // mostly the o.tag here is 'section', it means the text/s has no tags yet
        // basing on the pattern mentioned above, it should be
        // grandParent then parent then tag, so div would always be first tag
        newContent = `<${o.newTag}>${o.content}</${o.newTag}>`;

        // replace the selected texts with its corresponding tags
        document.execCommand('insertHTML', false, newContent);
    }
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

function modalShowMod(targetModal, textMsg) {
    targetModal.find('.modal-dialog').addClass('modal-lg');
    targetModal.find('.modal-body').addClass('modal-modified');
    targetModal.find('.modal-body').html(textMsg);
    targetModal.modal('show');

    targetModal.on('hidden.bs.modal', (e) => {
        targetModal.find('.modal-dialog').removeClass('modal-lg');
        targetModal.find('.modal-body').removeClass('modal-modified');
    });
}

function modalShow(targetModal, textMsg) {
    targetModal.find('.modal-body').text(textMsg);
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

function saveDataLocally(name, target) {
    ls.remove(name);

    const allData = target.html();
    const dataLength = target.text().length;

    if (dataLength > 1) {
        // Save texts here to local storage
        ls.set(name, allData);
    }
}

function saveMacAdressLocally(name, macAdd) {
    ls.remove(name);
    ls.set(name, macAdd);
}

// function createElement(el, attribs, funcs) {
//     const link = document.createElement(el);
//
//     Object.keys(attribs).forEach(function (prop) {
//         link.setAttribute(prop.toString(), attribs[prop]);
//     });
//
//     Object.keys(funcs).forEach(function (prop) {
//         link.`${prop()}`;
//     });
// }

// snippet by Xeoncross, but modified it a bit
// https://jsfiddle.net/Xeoncross/4tUDk/
function putContentAtCaret(content, range) {
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
    validateSelStr,
    modalShow,
    modalShowMod,
    saveDataLocally,
    saveMacAdressLocally,
    downloader,
    validateSelStrIfNot,
};
