import { JSChart } from './js-chart.js'
import { CoinTable } from './coin-table.js'
import { TrackerHeader } from './tracker-header.js'
import { IndexValue } from './index-value.js'
import { TechnicalIndicators } from './technical-indicators.js';

const m = window.preact.h

export function RootPage (dispatch) {
  const ChartPage = JSChart(dispatch)
  const CoinTableContent = CoinTable(dispatch)
  const TrackerHeaderContent = TrackerHeader(dispatch)
  const IndexValueContent = IndexValue(dispatch)
  const TechnicalIndicatorsContent = TechnicalIndicators(dispatch)

  return state => {
    if (state.initialLoad) return m('div', {}, 'Loading...')

    return m(
      'div',
      { id: 'main' },
      state.options.show_header && TrackerHeaderContent(state),
      state.options.show_c50_index && IndexValueContent(state),
      state.options.show_technical_indicators && TechnicalIndicatorsContent(state),
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
