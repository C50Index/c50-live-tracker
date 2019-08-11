import {
  m
} from '../core/markact.js'

export function CancelButton (onclick) {
  return m('button', {
    onclick: () => onclick(),
    'tab-index': 0,
    class: 'btn btn-secondary',
    style: 'border: 1px solid #000000;'
  },
  'Cancel'
  )
}
