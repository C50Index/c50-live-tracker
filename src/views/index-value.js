import { IndexData } from '../state.js'
const m = window.preact.h

export function IndexValue (dispatch) {
  return state => {
    let numerator = 0
    const numeratorKey = IndexData[state.options.current_index].numeratorKey
    const key = IndexData[state.options.current_index].summaryKey
    for (const slug in state[key]) {
      const summary = state[key][slug]
      if (!state[key][slug][numeratorKey]) {
        continue // skip the ones that aren't included
      }
      numerator += Number(summary[numeratorKey])
    }

    return m(
      'div',
      { class: 'tc' },
      state.options.show_c50_index_image &&
        m('img', {
          src: `https://cdn.answrly.com/c50/logos/c-c50-logo.png`,
          width: 32,
          height: 32
        }),
      m(
        'span',
        { style: 'color: #111111; font-weight: 700;' },
        (numerator / IndexData[state.options.current_index].divisor)
      )
    )
  }
}
