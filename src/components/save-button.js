import {
  m
} from "../core/markact.js";



export function SaveButton(onclick) {
  return m('button', {
      onclick: (id) => onclick(id),
      class: 'btn btn-success',
      style: 'border: 1px solid #000000;'
    },
    "Save"
  );
}
