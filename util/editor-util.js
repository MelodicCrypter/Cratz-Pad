// =========================================================
// =                TEXT EDITOR UTILITIES                  =
// =========================================================

// Library
import ls from 'local-storage';

/**
 * Normalizer for jQuery objects, if prefer dom nodes
 *
 * @param target
 * @returns {*}
 */
function nodeNormalizer(target) {
    let domTarget = target;

    // if jQuery convert to dom node
    if (target instanceof jQuery) {
        domTarget = target.get(0);
    }

    return domTarget;
}

/**
 * Windows Selection for mozilla
 *
 * @returns {}  an object containing all selections and properties
 */
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

/**
 * Windows Selection for Chrome
 *
 * @returns {}  an object containing all selections and properties
 */
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

/**
 * Menu button enabler, a jQuery object
 * this will enable all elements that has a disabled class
 *
 * @param target
 */
function enableMenuButtons(target) {
    if (target.hasClass('disabled')) {
        target.removeClass('disabled');
    }
}

/**
 * Menu button disabler, a jQuery object
 * this will add disabled class to the element
 * @param target
 */
function disableMenuButtons(target) {
    if (!target.hasClass('disabled')) {
        target.addClass('disabled');
    }
}

/**
 * This will fire up when the user clicks the buttons: B, I, U, and Alignments Buttons
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
    } else if (o.newTag === 'align-all-left'
        || o.newTag === 'align-all-center'
        || o.newTag === 'align-all-right'
        || o.newTag === 'align-all-justify') {
        // All alignment names in an array
        const alignments = ['align-all-left', 'align-all-center', 'align-all-right', 'align-all-justify'];

        // Remove all alignment name, just to make sure
        alignments.forEach((a) => {
            o.target.classList.remove(a.toString());
        });

        // Add the new alignment name as a new class
        o.target.classList.add(o.newTag);
        o.target.focus();

        // Save to local storage the user's last setting for alignment
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

/**
 * A simple string validator
 *
 * @param tests
 * @param subject
 * @param passStat
 * @returns {boolean}
 */
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

/**
 * Opens the modal element and then injecting the message
 * this is the modal with a unique customization
 *
 * @param targetModal
 * @param textMsg
 */
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

/**
 * Opens the modal element and then injecting the message
 * this is the ordinary modal
 *
 * @param targetModal
 * @param textMsg
 */
function modalShow(targetModal, textMsg) {
    targetModal.find('.modal-body').text(textMsg);
    targetModal.modal('show');
}

/**
 * A simple downloader
 *
 * @param filename
 * @param data
 */
function downloader(filename, data) {
    const target = document.createElement('a');
    target.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
    target.setAttribute('download', filename);
    target.style.display = 'none';
    document.body.appendChild(target);
    target.click();
    document.body.removeChild(target);
}

/**
 * Will save data (texts) to local storage
 * so that when user opens the app again, previous work shall be served
 *
 * @param name
 * @param target
 */
function saveDataLocally(name, target) {
    // Remove all saved related to this key: name
    ls.remove(name);

    const allData = target.html();
    const dataLength = target.text().length;

    // If data has length, then save
    if (dataLength > 1) {
        // Save texts here to local storage
        ls.set(name, allData);
    }
}

/**
 * Will save user's mac address to local storage
 * this is used for the unique naming for local storage key
 *
 * @param name
 * @param macAdd
 */
function saveMacAdressLocally(name, macAdd) {
    // Remove all saved related to this key: name
    ls.remove(name);

    // Save
    ls.set(name, macAdd);
}

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
};
