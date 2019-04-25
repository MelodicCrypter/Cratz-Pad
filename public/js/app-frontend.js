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

// Assets or Files
import peopleLogo from '../img/neutral_decision.svg';
import natureLogo from '../img/landscape.svg';
import foodsLogo from '../img/shop.svg';
import activityLogo from '../img/sports_mode.svg';
import placesLogo from '../img/binoculars.svg';
import symbolsLogo from '../img/doughnut_chart.svg';
import flagsLogo from '../img/globe.svg';
import emojiButtonSVG from '../img/emoji-btn.svg';

// Utility Modules
import * as ButtonsEditor from '../../util/editor-buttons-utils';
import * as TextareaEditor from '../../util/editor-util';
import * as Caret from '../../util/caret-utils';
import checkWhichKey from '../../util/keyboard-util';
import toggler from '../../util/toggler-util';

// ==============================================================================
// DOM
// ===============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // =======> EmojiPicker
    const container = document.getElementById('main-box');
    const emojiButton = document.getElementById('emoji-button');
    const textarea = document.getElementById('textarea');
    const textareaEditor = document.getElementsByClassName('editor');
    // Query version of some variables above, because EmojiPicker uses vanilla
    const emojiButtonJQuery = $('#emoji-button');
    const textareaJQuery = $('div[contenteditable="true"]');
    const menuButtons = $('.nav-link');

    // the Cratz Pad - EmojiPicker settings
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
    // calling listenON
    cratzPad.listenOn(emojiButton, container, textarea);

    // => emoji button svg
    emojiButtonJQuery.html(emojiButtonSVG);

    // => Focus textarea on load, put cursor at the end
    Caret.putCursorAtEnd(textarea);

    // ==============================================================================
    // Editor: Click Handlers
    // ===============================================================================
    // ======> Settings, all variables for the events below
    let openEmoji = false; // status if Emoji is allowed
    let disableShortcuts = false; // status if Hot-Keys are enabled or not
    let winSel = {}; // object that will contain all window.getSelection
    let caretPosition; // for the cursor position
    let rangeStart; // will hold the start of the selected range
    let rangeEnd; // will hold the end of the selected range

    // ======> Listening for keydown events
    document.addEventListener('keydown', (e) => {
        // 1. Determine which key was pressed
        const key = checkWhichKey(e);

        // 2. If TAB key was pressed, and HOT-KEYS are enabled
        if (!disableShortcuts && key === 'Tab') {
            e.preventDefault();

            // Detect if EmojiPicker is currently opened or close
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

        // If ESC key was pressed, and HOT-KEYS are enabled
        // if (!disableShortcuts && key === 'Esc') {
        //     e.preventDefault();
        // }
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
            if (is.firefox()) {
                caretPosition = Caret.getCaretPos(textarea);
                winSel = TextareaEditor.mozGetSelections(); // object of selections for mozilla
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

            // 2.3 Enable main menu buttons, B I U etc... if some texts have been selected
            // but if nothing is selected, and if there is one but not a text
            if (winSel.selectedTextsLen < 1) {
                TextareaEditor.disableMenuButtons(menuButtons);
            } else {
                TextareaEditor.enableMenuButtons(menuButtons);
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

    // =======> Listen for any key combination shortcuts
    // hotkeys('ctrl+a,cmd+a,command+a', (e, h) => {
    //     e.preventDefault();
    //     // if (window.getSelection) {
    //     //     caretPosition = Caret.getCaretPos(textarea);
    //     //     winSel = TextareaEditor.getSelections();
    //     // }
    //     alert('pressed cmd a');
    // });

    // ===============================================================================
    // Button Menus : Click Events
    // ===============================================================================
    // =======> When 'Disable Hot-Keys' is clicked
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
        // 1. double check if selectedTexts is !empty and !undefined
        if (winSel.selectedTexts === undefined || winSel.selectedTexts === '') {
            // if undefined or empty then exit
            e.preventDefault();
            e.stopPropagation();

            return;
        }

        // 2. Determine if chrome of firefox. Cause both browsers behave differently in handling the text selections
        // 2.1 FIREFOX
        if (is.firefox()) {

        }

        // 2.2 CHROME
        if (is.chrome()) {
            // determine these elements first if already contained inside <STRONG> or not
            if (winSel.textNodeVal === 'strong') {
                // add a unique attribute to the <strong> tag
                winSel.addAttToParent.setAttribute('tag-selected', 'true');
                // then delete
                $('[tag-selected]').remove();
                // then insert the new one without the <strong> tags
                TextareaEditor.putContentAtCaret(`${winSel.selectedTexts}`);
            } else {
                // if selected is clean, no <STRONG> tags yet
                const newSpanStrong = `<strong>${winSel.selectedTexts}</strong>`;
                // create a range
                const range = TextareaEditor.RangeAtIndex(textarea, rangeStart, rangeEnd);
                // set the range
                const sel = document.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                // delete the selected texts
                document.execCommand('delete', false, null);
                // replace with a new one contained within <STRONG> tags
                TextareaEditor.putContentAtCaret(newSpanStrong);
            }
        }

        // 3. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    $('#edit-italic').on('click', (e) => {

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
});
