// A utility that toggles any item
function toggler(item, defaultState, toggleToThisState) {
    // defaultState, current state of target
    // toggleToThisState, toggle to the reverse of the current state
    item === defaultState
        ? item = toggleToThisState
        : item = defaultState;

    return item;
}

export default toggler;
