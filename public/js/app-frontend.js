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
import hotkeys from 'hotkeys-js';
import is from '../../node_modules/is_js/is.min';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle';
import emojiCheck from '../../node_modules/emoji-aware';

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

// Utility Modules
import * as ButtonsEditor from '../../util/editor-buttons-utils';
import * as TextareaEditor from '../../util/editor-util';
import * as Caret from '../../util/caret-utils';
import checkWhichKey from '../../util/keyboard-util';
import toggler from '../../util/toggler-util';

// ==============================================================================
// Set up: Basic Settings before the DOM contents are loaded
// ==============================================================================
// 1. Load .ico file
const favicon = document.querySelector("link[rel='icon']");
favicon.href = favIcoPath;
// 2. Load app logo
const logo = document.getElementById('appLogo');
logo.src = appLogoPath;
// 3. Load loader image
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
        }

        // 3.1 If Chrome, show main
        if (is.chrome()) {
            $('#main-container').show();
            $('#loader').detach(); // detach the loader element from the DOM
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
    // Parent container of the div or textarea
    const container = document.getElementById('main-box');

    // Button for the emojis: jQuery and vanilla
    const emojiButton = document.getElementById('emoji-button');
    const emojiButtonJQuery = $('#emoji-button');

    // The 'textarea' which in this case is a contenteditable: both jQuery and vanilla
    const textarea = document.getElementById('textarea');
    const textareaEditor = document.getElementsByClassName('editor');
    const textareaJQuery = $('div[contenteditable="true"]');

    // The class for the bottom menus
    const menuButtons = $('.bott-nav');

    // The Cratz Pad - EmojiPicker settings
    const cratzPad = new EmojiPicker({
        // callback: () => TextareaEditor.reloadContent(textarea, picker.getText()),
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

    // Calling listenON
    cratzPad.listenOn(emojiButton, container, textarea);

    // Emoji button svg
    emojiButtonJQuery.html(emojiButtonSVG);

    // Focus textarea on load, put cursor at the end
    Caret.putCursorAtEnd(textarea);

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

    // =======> Listening for keydown events to toggle something
    textarea.addEventListener('keydown', (e) => {
        // 1. Determine which key was pressed
        const key = checkWhichKey(e);

        // 2. If TAB key was pressed, and HOT-KEYS are enabled
        if (!disableShortcuts && key === 'Tab') {
            e.preventDefault();

            // 2.1 Detect if EmojiPicker is currently opened or close
            if (!openEmoji) {
                cratzPad.openPicker(e);
                openEmoji = toggler(openEmoji, true, false);
            } else {
                setTimeout(() => $('#emoji-picker').detach(), 100);
                openEmoji = toggler(openEmoji, true, false);
            }
        }

        // 3. If shortcuts are disabled, but TAB was pressed
        if (disableShortcuts && key === 'Tab') {
            e.preventDefault();
            // Insert a normal tab space character
            document.execCommand('insertHTML', false, '&#009');
        }

        // 4. If ESC key was pressed, and HOT-KEYS are enabled
        // if (!disableShortcuts && key === 'Esc') {
        //     e.preventDefault();
        // }

        // Special treatment for Firefox when enter key is pressed inside contenteditable
        // NOTE: THIS IS DISCONTINUED
        if (is.firefox()) {
            if (key === 'Enter') {
                e.preventDefault();
                document.execCommand('insertLineBreak');
                // return false;
            }
        }
    }, false);

    // ========> Listen for any texts selection
    // This event is very vital cause in this section, selectedTexts, caretPosition, and textState will be set
    textareaJQuery.bind('mouseup keydown mousedown touchend', (e) => {
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

                // Get the start and end ranges, so that we can mimic, only needed if chrome
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
            }

            // 2.3 Check if winSel.selectedTexts has an emoji
            emojiCheck.onlyEmoji(winSel.selectedTexts).length > 0 ? emojiSelected = true : emojiSelected = false;

            // 2.4 Enable main menu buttons, B I U etc...
            // If it is a string and not empty and does not contain any emojis
            const tests = ['hasLength', 'isString'];
            if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'all') && !emojiSelected) {
                TextareaEditor.enableMenuButtons(menuButtons);
            } else {
                TextareaEditor.disableMenuButtons(menuButtons);
            }
        }

        // 3. If Shift key was used in selecting texts
        // if (e.shiftKey) {
        //     if (window.getSelection) {
        //         selectedTexts = window.getSelection().toString();
        //         caretPosition = window.getSelection().getRangeAt(0);
        //     } else if (document.selection) {
        //         selectedTexts = document.selection.createRange();
        //         caretPosition = textarea.selectionEnd;
        //     }
        // }
    });

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

    // =========> When B button is clicked
    $('#edit-bold').on('click', (e) => {
        // 1. Double check if selectedTexts is !empty and !undefined
        const tests = ['undefined', 'emptyString'];
        if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'notAll')) {
            // if undefined or empty then exit
            e.preventDefault();
            e.stopPropagation();

            return; // exit
        }

        // 2. Setup the options for process B button
        const options = {
            rangeStart,
            rangeEnd,
            target: textarea,
            content: winSel.selectedTexts,
            tag: winSel.textNodeVal,
            tagParent: winSel.textNodeParentVal,
            tagGrandParent: winSel.textNodeGrandParentVal,
            newTag: 'strong',
        };
        // 2.1 Start the process
        TextareaEditor.textSelExec(options);

        // 3. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    // ==========> When I button is clicked
    $('#edit-italic').on('click', (e) => {
        // 1. Double check if selectedTexts is !empty and !undefined
        const tests = ['undefined', 'emptyString'];
        if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'notAll')) {
            // if undefined or empty then exit
            e.preventDefault();
            e.stopPropagation();

            return; // exit
        }

        // 2. Setup the options for process B button
        const options = {
            rangeStart,
            rangeEnd,
            target: textarea,
            content: winSel.selectedTexts,
            tag: winSel.textNodeVal,
            tagParent: winSel.textNodeParentVal,
            tagGrandParent: winSel.textNodeGrandParentVal,
            newTag: 'em',
        };
        // 2.1 Start the process
        TextareaEditor.textSelExec(options);

        // 3. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    // ==========> When U button is clicked
    $('#edit-underline').on('click', (e) => {
        // 1. Double check if selectedTexts is !empty and !undefined
        const tests = ['undefined', 'emptyString'];
        if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'notAll')) {
            // if undefined or empty then exit
            e.preventDefault();
            e.stopPropagation();

            return; // exit
        }

        // 2. Setup the options for process B button
        const options = {
            rangeStart,
            rangeEnd,
            target: textarea,
            content: winSel.selectedTexts,
            tag: winSel.textNodeVal,
            tagParent: winSel.textNodeParentVal,
            tagGrandParent: winSel.textNodeGrandParentVal,
            newTag: 'u',
        };
        // 2.1 Start the process
        TextareaEditor.textSelExec(options);

        // 3. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    // ==============================================================================
    // Key-Combination: Listening for keydown events for Menu Buttons
    // ==============================================================================
    textarea.addEventListener('keydown', (e) => {
        // 1. Determine which key was pressed
        const key = checkWhichKey(e);

        // 5. If Command+B or Control+B are pressed
        if (e.metaKey && key === 'b') {
            e.preventDefault();
            e.stopPropagation();

            // 1. Double check if selectedTexts is !empty and !undefined
            const tests = ['undefined', 'emptyString'];
            if (TextareaEditor.validateSelStr(tests, winSel.selectedTexts, 'notAll')) {
                // if undefined or empty then exit
                e.preventDefault();
                e.stopPropagation();

                return; // exit
            }

            // 2. Setup the options for process B button
            const options = {
                rangeStart,
                rangeEnd,
                target: textarea,
                content: winSel.selectedTexts,
                tag: winSel.textNodeVal,
                tagParent: winSel.textNodeParentVal,
                tagGrandParent: winSel.textNodeGrandParentVal,
                newTag: 'strong',
            };
            // 2.1 Start the process
            TextareaEditor.textSelExec(options);

            // 3. Disable menu buttons
            TextareaEditor.disableMenuButtons(menuButtons);
        }
    });

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
