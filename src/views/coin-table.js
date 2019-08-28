import { updateComparedTo } from '../reducers/coin-reducer.js'
import { slugToHuman } from '../utils/slug-utils.js'

const m = window.preact.h

function Coin (summary, i, updateComparedTo, comparedTo) {
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
      class: `hover-bg-light-blue ${
        summary.slug === comparedTo ? 'background-light-blue' : ''
      }`,
      style: `color: ${color};`,
      onclick: () => {
        updateComparedTo(summary.slug)
      }
    },
    m('td', { class: 'tc', scope: 'col' }, String(i + 1)),
    m(
      'td',
      { class: 'tl', scope: 'col' },
      m('img', {
        class: 'img-responsive',
        src: `https://cdn.answrly.com/c50/coin-images/${summary.slug}.png`,
        width: 25,
        height: 25
      }),
      slugToHuman(summary.slug)
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
      { class: 'tr', scope: 'col' },
      `$${Number(summary.price).toLocaleString()}`
    ),
    m(
      'td',
      {
        class: 'tr',
        scope: 'col'
      },
      m(
        'a',
        {
          href: `https://www.c50index.com/currencies/${summary.slug}/`,
          target: '_blank'
        },
        'More'
      )
    )
  )
}

export function CoinTable (dispatch) {
  const dispatcher = {
    updateComparedTo: slug => dispatch(updateComparedTo(slug))
  }

  return state => {
    const summaries = []
    let loading = false
    for (const slug in state.coinSummaries) {
      const summary = state.coinSummaries[slug]
      if (!state.coinSummaries[slug].marketcap) {
        loading = true
        break
      }
      summaries.push(summary)
    }

    if (state.initialLoad && loading) return m('div', {}, 'Loading...')

    return m(
      'table',
      {
        class: 'table table-hover fixed_header'
      },
      m(
        'thead',
        {},
        m('th', { class: 'tc', scope: 'col' }, '#'),
        m('th', { class: 'tl', scope: 'col' }, 'Name'),
        m('th', { class: 'tr', scope: 'col' }, 'Market Cap'),
        m('th', { class: 'tr', scope: 'col' }, 'Price'),
        m('th', { class: 'tr', scope: 'col' }, 'More Info')
      ),
      m(
        'tbody',
        {},
        summaries
          .sort((a, b) => b.marketcap - a.marketcap)
          .map((summary, i) => {
            return Coin(
              summary,
              i,
              dispatcher.updateComparedTo,
              state.comparedTo
            )
          })
      )
    )
  }
}
