import {toggleDispatcher} from "../reducers/subreducers/toggles-reducer.js";
import {m} from "../core/markact.js";

export function CheckBox(state, dispatch, target, children) {
    let checkboxArgs = {type: "checkbox", onclick: toggleDispatcher(dispatch, target),  class: "form-check-input", id: target};
    if(state.toggles[target]) {
        checkboxArgs["checked"] = true;
    } else {
        delete checkboxArgs["checked"];
    }
    return m('label', {class: 'pointer'},
        m('input', checkboxArgs),
        children
    );
}
