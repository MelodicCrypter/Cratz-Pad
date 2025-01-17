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
import '../styles/aanjulena-sweet-toggle/custom-switch-toggle.scss';

// Library Modules
import $ from 'jquery';
import EmojiPicker from 'rm-emoji-picker';
import { saveAs } from 'file-saver';
import emojiCheck from 'emoji-aware';
import is from 'is_js';
import Cookies from 'js-cookie';
import ls from 'local-storage';
import LogRocket from 'logrocket';
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
import windowsLogoPath from '../img/windows-logo.png';
import appleLogoPath from '../img/apple-logo.png';
import sheetApplePath from '../img/sheets/sheet_apple_64_indexed_128.png';
import sheetGooglePath from '../img/sheets/sheet_google_64_indexed_128.png';
import sheetTwitterPath from '../img/sheets/sheet_twitter_64_indexed_128.png';
import * as intro from '../other/onload-intro';

// Own Utility Modules
import * as ButtonsEditor from '../../util/editor-buttons-utils';
import * as TextareaEditor from '../../util/editor-util';
import * as Caret from '../../util/caret-utils';
import checkWhichKey from '../../util/keyboard-util';
import toggler from '../../util/toggler-util';

// ==============================================================================
// LogRocket: Initialize
// ==============================================================================
LogRocket.init('zimys9/cratz-pad');

// ==============================================================================
// Set up: Basic Settings before the DOM contents are loaded
// ==============================================================================
// 0. Get user's mac address
const macAddress = document.getElementById('vit').innerText;
// 1. Load .ico file
const favicon = document.querySelector("link[rel='icon']");
favicon.href = favIcoPath;
// 2. Load app logo
const logo = document.getElementById('appLogo');
logo.src = appLogoPath;
// 3. Load app logo for alert modals
const logoImgAlertBox = document.getElementById('appLogoModal');
logoImgAlertBox.src = appLogoPath;
// 4. Load app logo for download modal box
const logoImgDownloadBox = document.getElementById('appLogoDownloadModal');
logoImgDownloadBox.src = appLogoPath;
// 5. Load loader image
const loaderImgTag = document.getElementById('loader-img');
loaderImgTag.src = loaderImgPath;
// 6. Set desktop platform logos
const loaderWindows32Img = document.getElementById('loader-windows32-img');
loaderWindows32Img.src = windowsLogoPath;
const loaderWindows64Img = document.getElementById('loader-windows64-img');
loaderWindows64Img.src = windowsLogoPath;
const loaderMacImg = document.getElementById('loader-mac-img');
loaderMacImg.src = appleLogoPath;

// ================================================================================
// onLOAD: Setting before showing the DOM
// =================================================================================
$(window).on('load', () => {
    // 1. Show main after 2 seconds
    setTimeout(() => {
        // 1.2 Hide now the loader
        $('#loader').hide();

        // 1.3 Determine if not Chrome, cause this app was designed to work perfectly
        // inside Chrome engine, if not Chrome, show the message
        if (is.firefox() || is.safari() || is.edge() || is.opera() || is.ie() || is.mobile()) {
            $('#notChromeMsg').show();
            $('#main-container').remove();
        }

        // 1.4 If Chrome and not mobile, show main
        if (is.chrome() || navigator.userAgent.match('CriOS') && is.not.mobile()) {
            $('#main-container').show();

            // 1.4.1
            const receivedData = ls.get(`${macAddress}allData`);
            if (receivedData !== null) {
                $('#textarea').html(receivedData);
            } else if (receivedData === null) {
                if (is.windows()) {
                    $('#textarea').html(intro.windowsPlatform);
                } else {
                    $('#textarea').html(intro.osxPlatform);
                }
            }

            // 1.4.2
            $('#loader').detach(); // detach the loader element from the DOM

            // 1.4.3 Check and set DARK MODE
            if (Cookies.get('darkmode') === undefined && Cookies.get('lightmode') === undefined) {
                // User did not set the mode, so default is ON
            } else if (Cookies.get('darkmode') === 'on') {
                // DARK MODE is ON
                $('body').removeClass('mode-lightmode');
                $('#mode-button')
                    .attr('aria-pressed', 'true')
                    .addClass('active');
            } else if (Cookies.get('lightmode') === 'on') {
                // DARK MODE is OFF
                $('body').addClass('mode-lightmode');
                $('#mode-button')
                    .attr('aria-pressed', 'false')
                    .removeClass('active');
            }

            // 1.4.4 Check alignment settings
            const alignmentData = ls.get('textareaAlignment');
            if (alignmentData !== null) {
                $('section[contenteditable="true"]').addClass(alignmentData.toString());
            }

            // 1.4.5
            Caret.putCursorAtEnd(document.getElementById('textarea')); // focus on the contenteditable
        }
    }, 2000);
});

// ==================================================================================
// DOM: This is the main core of the frontend
// ==================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // ==============================================================================
    // Set up: Setting for App download links
    // ===============================================================================
    const windows32AppLink = 'https://s3-ap-southeast-1.amazonaws.com/cratzpad-public/downloads/CratzPad_Setup_x32.exe';
    const windows64AppLink = 'https://s3-ap-southeast-1.amazonaws.com/cratzpad-public/downloads/CratzPad_Setup_x64.exe';
    const macOSAppLink = 'https://s3-ap-southeast-1.amazonaws.com/cratzpad-public/downloads/Cratz+Pad.dmg';

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
    const textareaEditor = document.getElementsByClassName('editor');
    const textareaJQuery = $('section[contenteditable="true"]');
    const downloadFilenameInput = $('input[name="download-filename"]');

    // ::::The class for the bottom menus
    const menuButtons = $('.bott-nav');

    // ::::The modals
    const modalTarget = $('#modalAlert');
    const modalDownload = $('#modalDownload');

    // ::::The Cratz Pad - EmojiPicker settings
    const cratzPad = new EmojiPicker({
        // ::::callback: () => TextareaEditor.reloadContent(textarea, picker.getText()),
        default_footer_message: 'Cratz Pad',
        show_colon_preview: false,
        positioning: 'vertical',
        use_sheets: true,
        sheets: {
            apple: sheetApplePath,
            google: sheetGooglePath,
            twitter: sheetTwitterPath,
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
    let textCount; // will hold total length of texts
    let userFinalFilename; // will hold the final filename when user saves to .txt

    // ========> Listen for any texts selection
    // This event is very vital cause in this section, selectedTexts, caretPosition, and textState will be set
    textareaJQuery.bind('mouseup keyup mousedown touchend', (e) => {
        // 1. Disable double click for selecting texts
        // if (e.detail > 1) {
        //     e.preventDefault();
        //     e.stopPropagation();
        // }

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
        e.stopPropagation();

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
            TextareaEditor.modalShow(modalTarget, '😊 Everything was copied. Paste the data somewhere.');
        } else {
            // 3.1 If fails, show modal alert
            TextareaEditor.modalShow(modalTarget, 'The area is empty. Please double check. 😊');
        }
    });

    // =========> When 'Download Button' is clicked
    $('#download-btn').on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        modalDownload.modal('show');

        $('#download-filename-btn').on('click', (ev) => {
            ev.preventDefault();

            // 1. Set focus on the conteneditable 'textarea'
            textareaJQuery.focus();

            // 2. Select all inside the textarea
            document.execCommand('selectAll', false, null);

            // 3. Get the selection
            const datatext = window.getSelection();

            // 4. Create a new Blob
            const blob = new Blob([datatext], { type: 'text/plain;charset=utf-8' });

            // 5. Create file name and a random number for the filename
            // const randomNum = Math.floor(Math.random() * 90000) + 10000;
            // const filename = `Cratz-Pad-${randomNum}.txt`;

            // 6. Save the file using file-save js
            saveAs(blob, `${userFinalFilename}.txt`);

            modalDownload.modal('hide');

            window.getSelection().removeAllRanges();

            textarea.focus();
        });
    });

    // =========> When 'About' is clicked
    $('#about-app').on('click', (e) => {
        e.preventDefault();

        TextareaEditor.modalShowMod(modalTarget, `${''
            + '<strong>Name:</strong> Cratz Pad'
            + '<br><br>'
            + '<strong>Version:</strong> 1.0.0'
            + '<br><br>'
            + '<strong>About:</strong> &nbsp; Cratz Pad is a really plain and simple app. It is your on-the-fly scratch.'
            + ' You do not need to create an account, start typing right away, and you can download your file as well. That easy.'
            + ' If you want to use Cratz Pad as standalone desktop app, you can download it using these links:'
            + '<br><br>'
            + 'Windows x32  <span class="modal-links app-link" data-whichlink="32"><img src="'}${windowsLogoPath}"></span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Windows x64 <span class="modal-links app-link" data-whichlink="64"><img src="${windowsLogoPath}"></span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Mac OS <span class="modal-links app-link" data-whichlink="0"><img src="${appleLogoPath}"></span>`
            + '<br><br>'
            + '<strong>Developer:</strong> Melodic Crypter'
            + '<br><br>'
            + '<strong>Website:</strong> <a href="https://www.melodiccrypter.com" target="_blank">Melodic Crypter Official</a>'
            + '<br><br>'
            + '<strong>GitHub:</strong> <a href="https://www.github.com/MelodicCrypter" target="_blank">GitHub Account</a>');
    });

    // =========> When B or I or U buttons are clicked
    $('#edit-bold, #edit-italic, #edit-underline').on('click', function (e) {
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

        let contentFinalLen;
        if (is.chrome() || is.firefox()) {
            contentFinalLen = winSel.selectedTextsLen;
        } else {
            contentFinalLen = winSel.selectedTextsLen + 1;
        }

        // 3. Setup the options for process B button
        const options = {
            rangeStart,
            rangeEnd,
            target: textarea,
            content: winSel.selectedTexts,
            contentLen: contentFinalLen,
            textOverallLen: textCount,
            tag: winSel.textNodeVal,
            tagParent: winSel.textNodeParentVal,
            tagGrandParent: winSel.textNodeGrandParentVal,
            tagGrandestParent: winSel.textNodeGrandGrandParentVal,
            nodeParent: winSel.parent,
            newTag: uniqueTag,
        };

        TextareaEditor.textSelExecFontStyle(options);

        Caret.setCaretPos(rangeStart);

        textarea.focus();

        // window.getSelection().removeAllRanges();

        // 4. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    // =========> When Left, Center, Right, Justify buttons are clicked
    $('#edit-left, #edit-center, #edit-right, #edit-justify').on('click', function (e) {
        // 2. Assign the tag whether 'strong', 'em', or 'u'
        const uniqueTag = $(this).attr('data-unique-tag');

        // 3. Setup the options for process B button
        const options = {
            target: textarea,
            newTag: uniqueTag,
        };

        TextareaEditor.textSelExecFontStyle(options);

        Caret.setCaretPos(rangeStart);

        textarea.focus();

        // window.getSelection().removeAllRanges();

        // 4. Disable menu buttons
        TextareaEditor.disableMenuButtons(menuButtons);
    });

    // ==============================================================================
    // Listening for keydown events for Download Input
    // ==============================================================================
    downloadFilenameInput.keyup(function (e) {
        const filterCharacters = /^[0-9a-zA-Z-]+$/;

        if ($(this).val().match(filterCharacters)) {
            $('#download-filename-btn').removeAttr('disabled');
            $('#download-filename-error').hide();

            const filename = $(this).val().trim();
            userFinalFilename = filename.replace(/[^a-zA-Z0-9-]/g, '');
        } else {
            $('#download-filename-btn').attr('disabled', true);
            $('#download-filename-error')
                .show()
                .text('Only AlphaNumeric. No special characters: .,!@#$%^&*(*) etc.');
        }
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

            if (!disableShortcuts) {
                // 3.1.3 Determine what tag to put
                key === 'b' ? uniqueTag = 'strong' : '';
                key === 'i' ? uniqueTag = 'em' : '';
                key === 'u' ? uniqueTag = 'u' : '';

                // 3.1.4 This is needed cause if selected texts contains an emoji and one of menu button is clicked
                // this will show a modal telling user why emoji can't be styled
                emojiCheck.onlyEmoji(winSel.selectedTexts).length > 0 ? emojiSelected = true : emojiSelected = false;

                let contentFinalLen;
                if (is.chrome() || is.firefox()) {
                    contentFinalLen = winSel.selectedTextsLen;
                } else {
                    contentFinalLen = winSel.selectedTextsLen + 1;
                }

                // 3.1.5 if no emoji is included then proceed with the process
                if (!emojiSelected) {
                    // 3.1.6 Setup the options for process B button
                    const options = {
                        rangeStart,
                        rangeEnd,
                        target: textarea,
                        content: winSel.selectedTexts,
                        contentLen: contentFinalLen,
                        textOverallLen: textCount,
                        tag: winSel.textNodeVal,
                        tagParent: winSel.textNodeParentVal,
                        tagGrandParent: winSel.textNodeGrandParentVal,
                        tagGrandestParent: winSel.textNodeGrandGrandParentVal,
                        nodeParent: winSel.parent,
                        newTag: uniqueTag,
                    };

                    // 3.1.7 Start the process
                    TextareaEditor.textSelExecFontStyle(options);

                    Caret.setCaretPos(rangeStart);

                    textarea.focus();

                    // window.getSelection().removeAllRanges();

                    // 3.1.8 Disable menu buttons
                    TextareaEditor.disableMenuButtons(menuButtons);
                } else {
                    // 3.1.6 If selected texts contains some emjois then show modal alert
                    TextareaEditor.modalShow(modalTarget, "😔 Emojis doesn't look great when styled. Text only please.");
                }
            } else {
                // if Hot-Keys are disabled
                TextareaEditor.modalShow(modalTarget, 'Hot-Keys are disabled. Enable it again by clicking 👍 button');
            }
        }


        if ((e.metaKey && key === '1')
            || (e.metaKey && key === '2')
            || (e.metaKey && key === '3')
            || (e.metaKey && key === '4')
            || (e.ctrlKey && key === '1')
            || (e.ctrlKey && key === '2')
            || (e.ctrlKey && key === '3')
            || (e.ctrlKey && key === '4')) {
            //
            e.preventDefault();
            e.stopPropagation();

            if (!disableShortcuts) {
                key === '1' ? uniqueTag = 'align-all-left' : '';
                key === '2' ? uniqueTag = 'align-all-center' : '';
                key === '3' ? uniqueTag = 'align-all-right' : '';
                key === '4' ? uniqueTag = 'align-all-justify' : '';

                const options = {
                    target: textarea,
                    newTag: uniqueTag,
                };

                // 3.1.7 Start the process
                TextareaEditor.textSelExecFontStyle(options);

                Caret.putCursorAtEnd(textarea);

                // window.getSelection().removeAllRanges();

                // 3.1.8 Disable menu buttons
                TextareaEditor.disableMenuButtons(menuButtons);
            } else {
                TextareaEditor.modalShow(modalTarget, 'Hot-Keys are disabled. Enable it again by clicking 👍 button');
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

        // 6. Special Case: to save data in localStorage
        // every time the user presses command or control keys
        // app should save all texts to the localStorage for backup
        // this is to prevent from losing data when user quits using shortcut keys
        if (e.metaKey || e.ctrlKey || key === 'Enter') {
            TextareaEditor.saveDataLocally(`${macAddress}allData`, textareaJQuery);
            TextareaEditor.saveMacAdressLocally('macAddress', macAddress);
        }

        // if (key === 'Del') {
        //     textPreTagCount = textarea.firstElementChild.textContent.length;
        //     if (textPreTagCount === 0) {
        //         e.preventDefault();
        //         e.stopPropagation();
        //     }
        // }

        // if (key === 'Enter') {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     document.execCommand('insertParagraph', false);
        //     document.execCommand('formatBlock', false, 'pre');
        //
        //     // This is still on debug mode
        //     const newPre = document.createElement('hr');
        //     textarea.insertAdjacentElement('beforeend', newPre);
        // }

        // NOTE: THIS SECTION IS DISCONTINUED
        // if (is.firefox()) {
        //     if (key === 'Enter') {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         document.execCommand('insertParagraph', false);
        //         document.execCommand('insertHTML', false, '<>');
        //         return false;
        //     }
        // }
    }, false);

    // ==============================================================================
    // Theme Buttons : this will allow user to set the app's theme
    // ==============================================================================
    // ======> Default is Dark Mode
    $('#mode-button').click(function () {
        const status = $(this).attr('aria-pressed');

        if (status === 'false') {
            // DARK MODE is ON
            $('body').removeClass('mode-lightmode');

            Cookies.remove('lightmode');
            Cookies.set('darkmode', 'on', { expires: 90 });
        }

        if (status === 'true') {
            // DARK MODE is OFF
            $('body').addClass('mode-lightmode');

            Cookies.remove('darkmode');
            Cookies.set('lightmode', 'on', { expires: 90 });
        }
    });

    // ===============================================================================
    // App-Link: When download links are clicked, inject respective url
    // ==============================================================================
    $('body').on('click', '.app-link', function (e) {
        e.preventDefault();

        const dataSpecificLink = $(this).attr('data-whichlink');
        let finalDownloadLinkHREF;

        if (dataSpecificLink === '32') {
            finalDownloadLinkHREF = windows32AppLink;
        }

        if (dataSpecificLink === '64') {
            finalDownloadLinkHREF = windows64AppLink;
        }

        if (dataSpecificLink === '0') {
            finalDownloadLinkHREF = macOSAppLink;
        }

        const link = document.createElement('a');
        link.href = finalDownloadLinkHREF;
        link.id = 'busy';
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => console.clear(), 5000);
    });

    // ===============================================================================
    // Bootstrap
    // ==============================================================================
    // =====> ToolTip
    $('.nav-link').tooltip();

    // ===============================================================================
    // Local Storage: beforeunload and on blur
    // ==============================================================================
    // =====> Save locally if window if reloaded or closed, on mouse leave, focusout
    $(window).bind('beforeunload', () => {
        TextareaEditor.saveDataLocally(`${macAddress}allData`, textareaJQuery);
        TextareaEditor.saveMacAdressLocally('macAddress', macAddress);
    });
    $(textareaJQuery).on('focusout', () => {
        TextareaEditor.saveDataLocally(`${macAddress}allData`, textareaJQuery);
        TextareaEditor.saveMacAdressLocally('macAddress', macAddress);
    });
    $(textareaJQuery).mouseleave(() => {
        TextareaEditor.saveDataLocally(`${macAddress}allData`, textareaJQuery);
        TextareaEditor.saveMacAdressLocally('macAddress', macAddress);
    });
}, false);
