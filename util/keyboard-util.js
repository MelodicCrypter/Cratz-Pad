// Utilities for Keyboard
function checkWhichKey(event) {
    let key;

    // If Tab was pressed
    if (event.which === 9) {
        key = 'Tab';
    }

    // If Esc was pressed
    if (event.which === 27) {
        key = 'Esc';
    }

    return key;
}

export default checkWhichKey;
