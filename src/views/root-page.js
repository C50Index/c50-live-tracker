import { JSChart } from './js-chart.js'
import { CoinTable } from './coin-table.js'
import { TrackerHeader } from './tracker-header.js'

const m = window.preact.h
const MARKET_WEIGHTED_DIVISOR = 214570583.32

export function RootPage (dispatch) {
  const ChartPage = JSChart(dispatch)
  const CoinTableContent = CoinTable(dispatch)
  const TrackerHeaderContent = TrackerHeader(dispatch)

  return state => {
    let loading = false
    let totalMarketcap = 0
    for (const slug in state.coinSummaries) {
      const summary = state.coinSummaries[slug]
      if (!state.coinSummaries[slug].marketcap) {
        loading = true
        break
      }
      totalMarketcap += summary.marketcap
    }
    if (state.initialLoad && loading) return m('div', {}, 'Loading...')

    return m(
      'div',
      { id: 'main' },
      state.options.show_header && TrackerHeaderContent(state),
      state.options.show_c50_index &&
        m(
          'div',
          { class: 'tc lead' },
          m('div', {}, `C50 Index: ${totalMarketcap / MARKET_WEIGHTED_DIVISOR}`)
        ),
      state.options.show_graph &&
        m(
          'div',
          { class: `${state.options.full_screen ? '' : 'container'}` },
          ChartPage(state)
        ),
      m(
        'div',
        { class: `${state.options.full_screen ? '' : 'container'}` },
        state.options.show_coin_table && CoinTableContent(state)
      )
    )
  }
}
