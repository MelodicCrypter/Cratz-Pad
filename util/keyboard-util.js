// Utilities for Keyboard
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

    // If r was pressed
    if (event.which === 82) {
        key = 'r';
    }

    // If 1 was pressed
    if (event.which === 1) {
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

    return key;
}

export default checkWhichKey;
