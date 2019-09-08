import { CoinSummaryKey, MarketWeightedDivisor } from '../state.js'
const m = window.preact.h

export function IndexValue (dispatch) {
  return state => {
    let totalMarketcap = 0
    const key = CoinSummaryKey[state.currentIndex]
    for (const slug in state[key]) {
      const summary = state[key][slug]
      if (!state[key][slug].marketcap) {
        break
      }
      totalMarketcap += summary.marketcap
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
        (totalMarketcap / MarketWeightedDivisor[state.currentIndex]).toFixed(2)
      )
    )
  }
}
