/*
* Cratz Pad
*
* This is a very simple scratch pad where you can write anything you want,
* anytime, anywhere. You will also be able to download your file.
*
* Copyright 2019, Hugh Caluscusin (@MelodicCrypter)
*
* Licensed under the MIT license:
* https://opensource.org/licenses/MIT
*/

// Styles: SCSS or CSS
import '../styles/app-main.scss';

// Library Modules
import $ from 'jquery';
import EmojiPicker from 'rm-emoji-picker';
import { saveAs } from 'file-saver';
import emojiCheck from '../../node_modules/emoji-aware';
import is from '../../node_modules/is_js/is.min';
import isElectron from 'is-electron';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';

// Assets or Files
import peopleLogo from '../img/neutral_decision.svg';
import natureLogo from '../img/landscape.svg';
import foodsLogo from '../img/shop.svg';
import activityLogo from '../img/sports_mode.svg';
import placesLogo from '../img/binoculars.svg';
import symbolsLogo from '../img/doughnut_chart.svg';
import flagsLogo from '../img/globe.svg';
import emojiButtonSVG from '../img/emoji-btn.svg';
import favIcoPath from '../img/favicon.ico';
import appLogoPath from '../img/cratz-pad-app-logo.png';
import loaderImgPath from '../img/loader.gif';

// Own Utility Modules
import * as ButtonsEditor from '../../util/editor-buttons-utils';
import * as TextareaEditor from '../../util/editor-util';
import * as Caret from '../../util/caret-utils';
import checkWhichKey from '../../util/keyboard-util';
import toggler from '../../util/toggler-util';
import { rangeAtIndex } from '../../util/editor-util';

// ==============================================================================
// Set up: Basic Settings before the DOM contents are loaded
// ==============================================================================
// 1. Load .ico file
const favicon = document.querySelector("link[rel='icon']");
favicon.href = favIcoPath;
// 2. Load app logo
const logo = document.getElementById('appLogo');
logo.src = appLogoPath;
// 3. Load app logo for alert modals
const logoImgAlertBox = document.getElementById('appLogoModal');
logoImgAlertBox.src = appLogoPath;
// 4. Load loader image
const loaderImgTag = document.getElementById('loader-img');
loaderImgTag.src = loaderImgPath;

// ================================================================================
// onLOAD: Hide loader and show the main container
// =================================================================================
$(window).on('load', () => {
    // 1. Show main after 2 seconds
    setTimeout(() => {
        // 2. Hide now the loader
        $('#loader').hide();

        // 3. Determine if not Chrome, cause this app was designed to work perfectly
        // inside Chrome engine, if not Chrome, show the message
        if (is.firefox() || is.safari() || is.edge() || is.opera() || is.ie()) {
            $('#notChromeMsg').show();
            $('#main-container').remove();
        }

        // 3.1 If Chrome, show main
        if (is.chrome()) {
            $('#main-container').show();
            $('#loader').detach(); // detach the loader element from the DOM
            Caret.putCursorAtEnd(document.getElementById('textarea').lastChild); // focus on the contenteditable
        }
    }, 2000);
});

// ==================================================================================
// DOM: This is the main core of the frontend
// ==================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // ==============================================================================
    // Set up: Settings for EmojiPicker and variables related to textarea
    // ===============================================================================
    // ::::Parent container of the div or textarea
    const container = document.getElementById('main-box');

    // Button for the emojis: jQuery and vanilla
    const emojiButton = document.getElementById('emoji-button');
    const emojiButtonJQuery = $('#emoji-button');

    // ::::The 'textarea' which in this case is a contenteditable: both jQuery and vanilla
    const textarea = document.getElementById('textarea');
    const textareaSelector = document.querySelector('[contenteditable]');
    const textareaEditor = document.getElementsByClassName('editor');
    const textareaJQuery = $('section[contenteditable="true"]');

    // ::::The class for the bottom menus
    const menuButtons = $('.bott-nav');

    // ::::The modals
    const modalTarget = $('#modalAlert');
    const modalBody = $('.modal .modal-body');
    const modalDialog = $('.modal-dialog');

    // ::::The Cratz Pad - EmojiPicker settings
    const cratzPad = new EmojiPicker({
        // ::::callback: () => TextareaEditor.reloadContent(textarea, picker.getText()),
        default_footer_message: 'Cratz Pad',
        show_colon_preview: false,
        positioning: 'vertical',
        use_sheets: true,
        sheets: {
            apple: '/sheets/sheet_apple_64_indexed_128.png',
            google: '/sheets/sheet_google_64_indexed_128.png',
            twitter: '/sheets/sheet_twitter_64_indexed_128.png',
            emojione: '/sheets/sheet_emojione_64_indexed_128.png',
        },
        categories: [
            {
                title: 'People',
                icon: `<span class="svg-menus">${peopleLogo}</span>`,
            },
            {
                title: 'Nature',
                icon: `<span class="svg-menus">${natureLogo}</span>`,
            },
            {
                title: 'Foods',
                icon: `<span class="svg-menus">${foodsLogo}</span>`,
            },
            {
                title: 'Activity',
                icon: `<span class="svg-menus">${activityLogo}</span>`,
            },
            {
                title: 'Places',
                icon: `<span class="svg-menus">${placesLogo}</span>`,
            },
            {
                title: 'Symbols',
                icon: `<span class="svg-menus">${symbolsLogo}</span>`,
            },
            {
                title: 'Flags',
                icon: `<span class="svg-menus">${flagsLogo}</span>`,
            },
        ],
    });

    // ::::Calling listenON
    cratzPad.listenOn(emojiButton, container, textarea);

    // ::::Emoji button svg
    emojiButtonJQuery.html(emojiButtonSVG);

    // ==============================================================================
    // Editor: Click Handlers
    // ===============================================================================
    // ======> Settings, all variables for the sections below, serves as the 'global' holders
    let openEmoji = false; // status if Emoji is allowed
    let disableShortcuts = false; // status if Hot-Keys are enabled or not
    let emojiSelected = false; // if a selected string includes emoji, cancel text process
    let winSel = {}; // object that will contain all window.getSelection
    let caretPosition; // for the cursor position
    let rangeStart; // will hold the start of the selected range
    let rangeEnd; // will hold the end of the selected range
    let textCount;
    let textPreTagCount;

    textarea.addEventListener('focus', () => {
        textCount = textarea.innerText.length;
        textPreTagCount = textarea.firstElementChild.textContent.length;
    });

    // ========> Listen for any texts selection
    // This event is very vital cause in this section, selectedTexts, caretPosition, and textState will be set
    textareaJQuery.bind('mouseup keyup mousedown touchend', (e) => {
        textCount = textarea.innerText.length;
        textPreTagCount = textarea.firstElementChild.textContent.length;


        // 1. Disable double click for selecting texts
        if (e.detail > 1) {
            e.preventDefault();
            e.stopPropagation();
        }

        // 2. If there is a selection
        if (window.getSelection) {
            // 2.1 Determine which browser. Firefox works better if focusNode is used
            // NOTE: THIS IS DISCONTINUED. THIS APP WAS DESIGNED FOR CHROME ENGINE
            if (is.firefox()) {
                caretPosition = Caret.getCaretPos(textarea);
                winSel = TextareaEditor.mozGetSelections(); // object of selections for mozilla

                // Get the start and end ranges, so that we can mimic
                const proRanger = TextareaEditor.proRanger(textareaEditor);
                rangeStart = proRanger.start;
                rangeEnd = proRanger.end;
            }

            // 2.2 Chrome works better if anchorNode is used
            if (is.chrome()) {
                caretPosition = Caret.getCaretPos(textarea);
                winSel = TextareaEditor.chromeGetSelections(); // object of selections for chrome

                // Get the start and end ranges, so that we can mimic, only needed if chrome
                const proRanger = TextareaEditor.proRanger(textareaEditor);
                rangeStart = proRanger.start;
                rangeEnd = proRanger.end;

                console.log(rangeStart, rangeEnd);
            }

            // 2.3 Check if winSel.selectedTexts has an emoji
            emojiCheck.onlyEmoji(winSel.selectedTexts).length > 0 ? emojiSelected = true : emojiSelected = false;

            // 2.4 Enable main menu buttons, B I U etc...,
            // If it is a string and not empty and does not contain any emojis
            const tests = ['hasLength', 'isString'];
            if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'all') && !emojiSelected) {
                TextareaEditor.enableMenuButtons(menuButtons);
            } else {
                TextareaEditor.disableMenuButtons(menuButtons);
            }
        }
    });

    // function handlePaste(e) {
    //     let clipboardData, pastedData;
    //
    //     // Stop data actually being pasted into div
    //     e.stopPropagation();
    //     e.preventDefault();
    //
    //     // Get pasted data via clipboard API
    //     clipboardData = e.clipboardData || window.clipboardData;
    //     pastedData = clipboardData.getData('Text/Plain').trim();
    // }
    //
    // document.addEventListener('paste', handlePaste);

    // ===============================================================================
    // Button Menus : Click Events
    // ===============================================================================
    // =========> When 'Disable Hot-Keys' is clicked
    $('#btn-menu-disable').on('click', function (e) {
        e.preventDefault();

        // 1. Determine Hot-Keys status first, if enabled or disabled, then toggle the opposite
        // this will return either true or false
        disableShortcuts = ButtonsEditor.toggleHotKeys($(this));

        // 2. Set caret position where it was originally
        Caret.setCaretPos(textarea, (caretPosition));
    });

    // =========> When 'Auto Copy All' is clicked
    $('#auto-copy-all').on('click', (e) => {
        e.preventDefault();

        // 1. Set focus on the conteneditable 'textarea'
        textareaJQuery.focus();

        // 2. Select all and assign the selection to variable
        document.execCommand('selectAll', false, null);
        const tempSelectedTexts = window.getSelection().toString();

        // 3. Check first if the contenteditable area is not empty
        const tests = ['isString', 'hasLength'];
        if (TextareaEditor.validateSelStr(tests, tempSelectedTexts, 'all')) {
            // 3.1 if all passes, copy
            document.execCommand('copy', false, null);

            // 3.2 Remove all ranges
            window.getSelection().removeAllRanges();

            // 3.3. Show modal alert telling that all texts were copied
            TextareaEditor.modalShow(modalTarget, modalBody, '😊 Everything was copied. Paste the data somewhere.');
        } else {
            // 3.1 If fails, show modal alert
            TextareaEditor.modalShow(modalTarget, modalBody, 'The area is empty. Please double check. 😊');
        }
    });

    // =========> When 'Download Button' is clicked
    $('#download-btn').on('click', (e) => {
        e.preventDefault();

        // 1. Set focus on the conteneditable 'textarea'
        textareaJQuery.focus();

        // 2. Select all inside the textarea
        document.execCommand('selectAll', false, null);

        // 3. Get the selection
        const datatext = window.getSelection();

        // 4. Create a new Blob
        const blob = new Blob([datatext], { type: 'text/plain;charset=utf-8' });

        // 5. Create file name and a random number for the filename
        const randomNum = Math.floor(Math.random() * 90000) + 10000;
        const filename = `Cratz-Pad-${randomNum}.txt`;

        // 6. Save the file using file-save js
        saveAs(blob, filename);

        // 7. Remove all ranges
        window.getSelection().removeAllRanges();
    });

    // =========> When 'About' is clicked
    $('#about-app').on('click', (e) => {
        e.preventDefault();

        TextareaEditor.modalShowMod(modalTarget, modalDialog, modalBody, ''
            + '<strong>Name:</strong> Cratz Pad'
            + '<br><br>'
            + '<strong>Version:</strong> 1.0.0'
            + '<br><br>'
            + '<strong>About:</strong> <br>Cratz Pad is a really plain and simple app where users can type all they want.'
            + ' Users can also download the file they are creating as plain text. You do not need to'
            + ' create an account. So, if you do not want to download your file you can simply copy it'
            + 'and paste it directly to your editor.'
            + '<br><br>'
            + '<strong>Developer:</strong> Melodic Crypter'
            + '<br><br>'
            + '<strong>Website:</strong> <a href="https://www.melodiccrypter.com" target="_blank">Melodic Crypter Official</a>'
            + '<br><br>'
            + '<strong>GitHub:</strong> <a href="https://www.github.com/MelodicCrypter" target="_blank">GitHub Account</a>');
    });

    // =========> When B or I or U buttons are clicked
    $('#edit-bold, #edit-italic, #edit-underline, #edit-left, #edit-center, #edit-right, #edit-justify').on('click', function (e) {
        // 1. Double check everything, if only texts were selected
        // no need to worry if it contains emojis cause it has been taken care of above
        const tests = ['undefined', 'emptyString'];
        if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'notAll')) {
            // if undefined or empty then exit
            e.preventDefault();
            e.stopPropagation();

            return; // exit
        }

        // 2. Assign the tag whether 'strong', 'em', or 'u'
        const uniqueTag = $(this).attr('data-unique-tag');

        // const commands = ['italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
        //
        // const yes = commands.includes(uniqueTag);

        if (isElectron()) {
            winSel.selectedTextsLen += 1;
        }

        // 3. Setup the options for process B button
        const options = {
            rangeStart,
            rangeEnd,
            target: textarea,
            content: winSel.selectedTexts,
            contentLen: winSel.selectedTextsLen,
            textOverallLen: textCount,
            tag: winSel.textNodeVal,
            tagParent: winSel.textNodeParentVal,
            tagGrandParent: winSel.textNodeGrandParentVal,
            tagGrandestParent: winSel.textNodeGrandGrandParentVal,
            nodeParent: winSel.parent,
            newTag: uniqueTag,
        };

        window.document.designMode = 'On';

        TextareaEditor.textSelExecFontStyle(options);

        window.document.designMode = 'Off';

        // 4. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);

        // Caret.putCursorAtEnd();
        Caret.setCaretPos(caretPosition);
        textarea.focus();
    });

    // ==============================================================================
    // Listening for keydown events for Menu Buttons
    // ==============================================================================
    textarea.addEventListener('keydown', (e) => {
        // 1. Determine which key was pressed
        const key = checkWhichKey(e);

        // 2. Set a uniqueKey first
        let uniqueTag;

        // 3.1. If Cmd+B or Ctrl+b, Cmd+I or Ctrl+I, Cmd+U or Ctrl+U
        if ((e.metaKey && key === 'b')
            || (e.metaKey && key === 'i')
            || (e.metaKey && key === 'u')
            || (e.ctrlKey && key === 'b')
            || (e.ctrlKey && key === 'i')
            || (e.ctrlKey && key === 'u')) {
            // 3.1.2 prevent all defaults
            e.preventDefault();
            e.stopPropagation();

            // 3.1.3 Determine what tag to put
            key === 'b' ? uniqueTag = 'strong' : '';
            key === 'i' ? uniqueTag = 'em' : '';
            key === 'u' ? uniqueTag = 'u' : '';

            // 3.1.4 This is needed cause if selected texts contains an emoji and one of menu button is clicked
            // this will show a modal telling user why emoji can't be styled
            emojiCheck.onlyEmoji(winSel.selectedTexts).length > 0 ? emojiSelected = true : emojiSelected = false;

            // 3.1.5 if no emoji is included then proceed with the process
            if (!emojiSelected) {
                // 3.1.6 Setup the options for process B button
                const options = {
                    rangeStart,
                    rangeEnd,
                    target: textarea,
                    content: winSel.selectedTexts,
                    tag: winSel.textNodeVal,
                    tagParent: winSel.textNodeParentVal,
                    tagGrandParent: winSel.textNodeGrandParentVal,
                    newTag: uniqueTag,
                };

                // 3.1.7 Start the process
                TextareaEditor.textSelExecFontStyle(options);

                // 3.1.8 Disable menu buttons
                TextareaEditor.disableMenuButtons(menuButtons);
            } else {
                // 3.1.6 If selected texts contains some emjois then show modal alert
                TextareaEditor.modalShow(modalTarget, modalBody, "😔 Emojis doesn't look great when styled. Text only please.");
            }
        }

        // 4. If TAB key was pressed, and HOT-KEYS are enabled
        if (!disableShortcuts && key === 'Tab') {
            e.preventDefault();

            // 4.1 Detect if EmojiPicker is currently opened or close
            if (!openEmoji) {
                cratzPad.openPicker(e);
                openEmoji = toggler(openEmoji, true, false);
            } else {
                setTimeout(() => $('#emoji-picker').detach(), 100);
                openEmoji = toggler(openEmoji, true, false);
            }
        }

        // 5. If shortcuts are disabled, but TAB was pressed
        if (disableShortcuts && key === 'Tab') {
            e.preventDefault();
            // Insert a normal tab space character
            document.execCommand('insertHTML', false, '&#009');
        }

        // 6.
        if (key === 'Del') {
            textPreTagCount = textarea.firstElementChild.textContent.length;
            if (textPreTagCount === 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        if (key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertParagraph', false);
            document.execCommand('formatBlock', false, 'pre');

            // This is still on debug mode
            const newPre = document.createElement('pre');
            textarea.insertAdjacentElement('beforeend', newPre);
        }

        // NOTE: THIS SECTION IS DISCONTINUED
        if (is.firefox()) {
            if (key === 'Enter') {
                e.preventDefault();
                document.execCommand('insertBrOnReturn');
                // return false;
            }
        }
    }, false);

    // Todo
    // create shortcut for text-aligns
    // and fix align, cause it will align all text, what if just a part you want to align
    // fix enable/disable hot-keys
    // themes
    // EVENT LISTENER FOR CLOSING THE WINDOW or Tab ==============
    // refactor if have time

    // ==============================================================================
    // Theme Buttons : this will allow user to set the app's theme
    // ==============================================================================
    // ======> Day
    $('#day-theme').on('click', ButtonsEditor.themeToggle($(this)));
    // ======> Night
    $('#night-theme').on('click', () => {
        $('body').css({ 'background-color': '#333' });
    });

    // ===============================================================================
    // Bootstrap
    // ==============================================================================
    // =====> ToolTip
    $('.nav-link').tooltip();
}, false);
