import { m } from '../core/markact.js'

// flashes = {1: {level: "primary", message: "some message"}, 2: {}}
export const Flashes = (flashes) => {
  return Object.keys(flashes).map((id) => {
    const flash = flashes[id]
    return m('div', { class: `alert alert-${flash.level}`, role: 'alert' },
      flash.message
    )
  })
}
