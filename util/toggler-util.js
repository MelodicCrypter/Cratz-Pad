// A utility that toggles any item
function toggler(item, defaultState, toggleToThisState) {
    // defaultState can be true, or on, anything similar
    // toggleToThisState can false, or off, etc
    item === defaultState
        ? item = toggleToThisState
        : item = defaultState;

    return item;
}

export default toggler;
