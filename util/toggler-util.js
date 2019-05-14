// =========================================================
// =                    TOGGLE UTILITY                     =
// =========================================================

/**
 * A very simple utility for toggling states
 * turn false to true, off to on, etc
 *
 * @param item
 * @param defaultState
 * @param toggleToThisState
 * @returns {*}
 */
function toggler(item, defaultState, toggleToThisState) {
    // defaultState, current state of target
    // toggleToThisState, toggle to the reverse of the current state
    item === defaultState
        ? item = toggleToThisState
        : item = defaultState;

    return item;
}

export default toggler;
