import { m } from '../core/markact.js'

// {label: string, value: string}
export function SelectSingle (selected, options = [], onchange) {
  if(!options || options.length === 0) options = [];
  // If options are strings, set the key and the value to the same thing.
  if(typeof options[0] === 'string') options = options.map(value => {return {label: value, value }});

  return m('select', { class: 'form-control', onchange: (e) => onchange(e.target.value) },
    options.map((option) => {
      return m('option', { value: option['value'], selected: selected == option.value }, option['label'])
    })
  )
}
