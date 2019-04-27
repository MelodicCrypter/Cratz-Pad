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

    return key;
}

export default checkWhichKey;
