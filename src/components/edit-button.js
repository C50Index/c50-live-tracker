import {
  m
} from '../core/markact.js'
import { SVGEdit } from './svgs.js'

export function EditButton (onclick) {
  return m('div', {
    class: 'pointer dib hover-fill-blue',
    onclick: (id) => onclick(id)
  }, SVGEdit({ class: '', fill: '#000000', width: '1.5rem' }))
}
