// Utilities for the Button menus

import nodeNormalizer from './editor-util';

/**
 * Toggle enable or disable Hot-Keys
 * @param target    should be a jQuery object
 * @return disableShortcuts     status of the Hot-Key, either true or false
 */
function toggleHotKeys(target) {
    let disableShortcuts;

    // Determine which class is currently set
    if (target.hasClass('fa-hand-paper')) {
        // Disable Hot-Key
        disableShortcuts = true;

        target
            .removeClass('fa-hand-paper') // Remove the class for the hand icon (symbol to disable HOT-KEYS)
            .addClass('fa-thumbs-up') // Add new class for enabling again HOT-KEYS
            .parent() // go to parent element, this case, the anchor tag, change attributes
            .attr({
                'data-original-title': 'Enable Hot-Key',
            })
            .tooltip('show'); // this will regenerate bootstrap attribute for data-original-title
    } else {
        // Enable Hot-Key
        disableShortcuts = false;

        // Do the reverse
        target
            .removeClass('fa-thumbs-up')
            .addClass('fa-hand-paper')
            .parent()
            .attr({
                'data-original-title': 'Disable Hot-Key',
            })
            .tooltip('show');
    }

    return disableShortcuts;
}

function themeToggle(theme) {
    console.log(theme);
}

export { themeToggle, toggleHotKeys };
