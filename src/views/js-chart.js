import { dateToUnix } from '../utils/date-utils.js'
import { slugToHuman } from '../utils/slug-utils.js'
import { IndexData } from '../state.js'

const m = window.preact.h
let prevState = null

function renderChart (state) {
  const chartDataKey = IndexData[state.options.current_index].chartDataKey

  if (!state[chartDataKey]) return
  if (!state[chartDataKey].map) return

  // memoize the state, don't re-render if nothing has changed :)
  if(isSame(prevState, state)) return;
  prevState = state

  const beginningPrice =
    state[chartDataKey][0][IndexData[state.options.current_index].name]

  const series = []

  /**
   * Don't show the last element because sometimes that value is wacky from the server... this should
   * probably be fixed at some point, but for now, we'll just throw it out.
   *  */

  const indexData = [] // The indexData for the chart

  // Let's not show the last 2 days because the data might not be loaded yet
  for (let i = 0; i < state[chartDataKey].length - 2; i++) {
    const summary = state[chartDataKey][i]
    const timeUnix = dateToUnix(new Date(summary.Date))
    const price =
      (Number(summary[IndexData[state.options.current_index].name]) -
        beginningPrice) /
      beginningPrice

    indexData.push({
      x: timeUnix,
      y: price
    })
  }
  series.push(indexData)

  // render the compared data if it exists
  if (
    !!state.options.compared_to &&
    state.coinData &&
    state.coinData[state.options.compared_to] &&
    indexData.length > 0
  ) {
    const comparedData = []
    const comparedHistory = state.coinData[state.options.compared_to]
    const sortedHistory = comparedHistory.sort(
      (a, b) => Number(a.time_unix) - Number(b.time_unix)
    )
    let comparedBeginningPrice = null

    for (const comparedCoin of sortedHistory) {
      if (Number(comparedCoin.time_unix) >= indexData[0].x) {
        if (!comparedBeginningPrice) {
          comparedBeginningPrice = Number(comparedCoin.close)
        }
        comparedData.push({
          x: Number(comparedCoin.time_unix),
          y:
            (Number(comparedCoin.close) - comparedBeginningPrice) /
            comparedBeginningPrice
        })
      }
    }
    series.push(comparedData)
  }

  return new window.Chartist.Line(
    '#theChart',
    {
      series: series
    },
    {
      axisX: {
        showLabel: true,
        type: window.Chartist.AutoScaleAxis, // This plots an offset for the x
        labelInterpolationFnc: function (timeUnix) {
          return new Date(timeUnix * 1000).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short'
          })
        }
      },
      axisY: {
        showLabel: true
      }
    }
  )
}

export function JSChart (dispatch) {
  return state => {
    renderChart(state)

    return m(
      'div',
      { class: 'tc' },
      m(
        'span',
        {},
        m('img', {
          src: `https://cdn.answrly.com/c50/logos/c-c50-logo.png`,
          width: 32,
          height: 32
        }),
        m(
          'span',
          { style: 'color: #2875e3; font-weight: 700;' },
          IndexData[state.options.current_index].displayName
        )
      ),
      state.options.compared_to &&
        m(
          'span',
          {},
          ' v ',
          m('img', {
            src: `https://cdn.answrly.com/c50/coin-images/${
              state.options.compared_to
            }.png`
          }),
          m(
            'span',
            {
              style: `color: #333333; font-weight: 700;`
            },
            slugToHuman(state.options.compared_to)
          )
        ),
      m('div', { id: 'theChart', class: 'pa1' })
    )
  }
}

function isSame(prevState, state) {
  const chartDataKey = IndexData[state.options.current_index].chartDataKey
  return (!!prevState &&
    state[chartDataKey] === prevState[chartDataKey] &&
    state.options.compared_to === prevState.options.compared_to &&
    !!state.coinData &&
    !!prevState.coinData &&
    prevState.coinData[state.options.compared_to] ===
      state.coinData[state.options.compared_to] &&
    state.options.current_index === prevState.options.current_index
  )
}