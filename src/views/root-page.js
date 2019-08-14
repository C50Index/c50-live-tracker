// import { m } from '../core/markact.js'
const m = window.preact.h

function Coin (summary, i) {
  let color = ''
  if (
    summary.price &&
    summary.previousPrice &&
    summary.price < summary.previousPrice
  ) {
    color = 'red'
  } else if (
    summary.price &&
    summary.previousPrice &&
    summary.price > summary.previousPrice
  ) {
    color = 'green'
  }

  return m(
    'tr',
    {
      class: 'hover-bg-light-blue',
      style: `color: ${color}`
    },
    m(
      'td',
      {
        class: 'tc',
        scope: 'col'
      },
      String(i + 1)
    ),
    m(
      'td',
      {
        class: 'tl',
        scope: 'col'
      },
      m('img', {
        class: 'img-responsive',
        src: `https://cdn.answrly.com/c50/coin-images/${summary.slug}.png`,
        width: 25,
        height: 25
      }),
      summary.slug
    ),
    m(
      'td',
      {
        class: 'tr',
        scope: 'col'
      },
      `$${summary.marketcap ? Number(summary.marketcap).toLocaleString() : '_'}`
    ),
    m(
      'td',
      {
        class: 'tr',
        scope: 'col'
      },
      `$${Number(summary.price).toLocaleString()}`
    )
  )
}

export function RootPage (dispatch) {
  return state => {
    const summaries = []
    let loading = false
    for (const slug in state.coinSummaries) {
      if (!state.coinSummaries[slug].marketcap) {
        loading = true
        break
      }
      summaries.push(state.coinSummaries[slug])
    }

    if (state.initialLoad && loading) return m('div', {}, 'Loading...')

    return m(
      'div',
      { id: 'main' },
      m(
        'table',
        {
          class: 'table table-hover'
        },
        m(
          'thead',
          {},
          m(
            'th',
            {
              class: 'tc',
              scope: 'col'
            },
            '#'
          ),
          m(
            'th',
            {
              class: 'tl',
              scope: 'col'
            },
            'Name'
          ),
          m(
            'th',
            {
              class: 'tr',
              scope: 'col'
            },
            'Market Cap'
          ),
          m(
            'th',
            {
              class: 'tr',
              scope: 'col'
            },
            'Price'
          )
        ),
        summaries
          .sort((a, b) => b.marketcap - a.marketcap)
          .map((summary, i) => {
            return Coin(summary, i)
          })
      )
    )
  }
}
