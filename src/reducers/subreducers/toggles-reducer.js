export function toggle(target, on = undefined ) {
    return {type: "toggle", on, target};
}

export function toggleDispatcher(dispatch, target, on = undefined) {
    return (e) => {
        if (e) {
            e.stopPropagation();
        }
        dispatch(toggle(target, on));
    }
}


export function reduceToggles(state, action) {
    let effects = [];
    switch (action.type) {
        case 'toggle':
            let result;
            if (action.on != null) {
                result = !!action.on;
            }
            else {
                result = !state[action.target];
            }

            if (result !== !!state[action.target]) {
                state = {...state};
                state[action.target] = result;
            }
            break;
    }
    return {state, effects};
}
