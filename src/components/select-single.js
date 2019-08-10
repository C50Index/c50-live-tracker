import {m} from "../core/markact.js";
    
// {label: string, value: string}
export function SelectSingle(selected, options=[], onchange) {
  return m('select', {class: 'form-control', onchange: (e) => onchange(e.target.value)}, {},
    options.map((option) => {
      return m('option', {value: option['value'], selected: selected==option.value}, option['label'])
    })
  );
}
  