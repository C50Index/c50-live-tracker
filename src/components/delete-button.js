import { m } from "../core/markact.js";
import { SVGTrash } from "./svgs.js";



export function DeleteButton(onclick) {
  return m('div',{
    class: 'pointer dib hover-fill-blue',
    onclick: (id) => onclick(id)
  }, SVGTrash({class: '', fill: '#000000', width: '1.5rem'}));
}
