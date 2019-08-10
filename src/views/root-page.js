import {
  m
} from "../core/markact.js";

function Coin(slug, price, i) {
  return m('tr', {
      class: 'hover-bg-light-blue'
    },
    m('td', {
      class: 'tc',
      scope: 'col'
    }, "" + (i)),
    m('td', {
        class: 'tl',
        scope: 'col'
      }, slug,
      m('img', {
        class: 'img-responsive',
        src: `https://cdn.answrly.com/c50/coin-images/${slug}.png`,
        width: '25px',
        height: '25px'
      }),
      name,
      ),
    m('td', {
      class: 'tr',
      scope: 'col'
    }, price)
  )
}

export function RootPage(dispatch) {
  return (state) => {
    if (state.initialLoad) return m('div', {}, "Loading...");
    return m('table', {
        class: 'table table-hover'
      },
      m('thead', {},
        m('th', {
          class: 'tc',
          scope: 'col'
        }, '#'),
        m('th', {
          class: 'tl',
          scope: 'col',
        }, 'Name'),
        m('th', {
          class: 'tr',
          scope: 'col'
        }, 'Price'),
        Object.keys(state.prices).map((slug, i) => {
          return Coin(slug, state.prices[slug], i)
        })
      )
    )
  }
}