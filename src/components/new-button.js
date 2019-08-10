import {
    m
  } from "../core/markact.js";
import { SVGPlusCircle } from "./svgs.js";
  
  
  
  export function NewButton(onclick) {
    return m('div',{
      class: 'pointer dib hover-fill-blue',
      onclick: (id) => onclick(id)
    }, SVGPlusCircle({class: '', fill: '#000000', width: '1.5rem'}));
  }
  