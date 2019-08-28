const m = window.preact.h

export function TrackerHeader (dispatch) {
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
      m('p', { class: 'lead' }, '50 Cryptos in 1')
    )
  }
}
