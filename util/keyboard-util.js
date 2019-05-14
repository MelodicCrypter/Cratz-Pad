// =========================================================
// =              UTILITY FOR KEYBOARD EVENTS              =
// =========================================================

/**
 * Simple utility that will return a readable string for specific key pressed
 *
 * @param event
 * @returns {string}
 */
function checkWhichKey(event) {
    let key;

    // If Tab was pressed
    if (event.which === 9 || event.key === 'Tab') {
        key = 'Tab';
    }

    // If Esc was pressed
    if (event.which === 27 || event.key === 'Escape') {
        key = 'Esc';
    }

    // If Esc was pressed
    if (event.which === 13 || event.key === 'Enter') {
        key = 'Enter';
    }

    // If Cmd or Command was pressed
    if (event.which === 224 || event.key === 'Meta') {
        key = 'Cmd';
    }

    // If Control was pressed
    if (event.which === 17 || event.key === 'Control') {
        key = 'Ctrl';
    }

    // If Delete was pressed
    if (event.which === 8 || event.key === 'Backspace') {
        key = 'Del';
    }

    // If a was pressed
    if (event.which === 65) {
        key = 'a';
    }

    // If b was pressed
    if (event.which === 66) {
        key = 'b';
    }

    // If i was pressed
    if (event.which === 73) {
        key = 'i';
    }

    // If u was pressed
    if (event.which === 85) {
        key = 'u';
    }

    // If l was pressed
    if (event.which === 76) {
        key = 'l';
    }

    // If q was pressed
    if (event.which === 81) {
        key = 'q';
    }

    // If r was pressed
    if (event.which === 82) {
        key = 'r';
    }

    // If v was pressed
    if (event.which === 86) {
        key = 'v';
    }

    // If 1 was pressed
    if (event.which === 49) {
        key = '1';
    }

    // If 2 was pressed
    if (event.which === 50) {
        key = '2';
    }

    // If 3 was pressed
    if (event.which === 51) {
        key = '3';
    }

    // If 4 was pressed
    if (event.which === 52) {
        key = '4';
    }

    return key;
}

export default checkWhichKey;
