import { m } from "../core/markact.js";

// https://xdsoft.net/jqplugins/datetimepicker/
export function DatePicker(valueUnix, onchange, options={}) {
  return m('input', {
    onRender: (e) => {
      $(e).datetimepicker(options) 
    },
    tabindex: "0",
    type: 'text',
    class: 'form-control',
    value: new Date(valueUnix * 1000).toLocaleString(),
    onchange: (e) => onchange(new Date(e.target.value).getTime() / 1000)
  });
}