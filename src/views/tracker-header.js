import { IndexData } from '../state.js'
import { setCurrentIndex } from '../reducers/coin-reducer.js'

const m = window.preact.h

export function TrackerHeader (dispatch) {
  const dispatcher = {
    setCurrentIndex: name => dispatch(setCurrentIndex(name))
  }
  return state => {
    return m(
      'div',
      { class: 'w-100 tc' },
      m(
        'div',
        { class: 'w-100 dib tc' },
        m('img', {
          class: 'tc',
          width: 100,
          src: 'https://cdn.answrly.com/c50/logos/c50-logo-black.svg'
        })
      ),
      m('h2', {}, 'C50 Tracker'),
      m('p', { class: 'lead' }, '50 Cryptos in 1'),
      m(
        'ul',
        { class: 'nav nav-tabs' },
        Object.keys(IndexData).map(currentIndex => {
          return m(
            'li',
            { class: 'nav-item' },
            m(
              'a',
              {
                class: `nav-link ${
                  state.options.current_index === currentIndex ? 'active' : ''
                }`,
                onclick: () => dispatcher.setCurrentIndex(currentIndex)
              },
              IndexData[currentIndex].displayName
            )
          )
        })
      )
    )
  }
}
