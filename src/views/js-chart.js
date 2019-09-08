import { dateToUnix } from '../utils/date-utils.js'
import { slugToHuman } from '../utils/slug-utils.js'
import { IndexData } from '../state.js'

const m = window.preact.h
let prevState = null

function getIndexName (currentIndex) {
  switch (currentIndex) {
    case 'c50':
      return 'C50Index'
    case 'c20':
      return 'C20Index'
  }
  return 'C50Index'
}

function renderChart (state) {
  const dataKey = IndexData[state.options.current_index].dataKey

  if (!state[dataKey]) return
  if (!state[dataKey].map) return

  // memoize the state, don't re-render if nothing has changed :)
  if (
    !!prevState &&
    state[dataKey] === prevState[dataKey] &&
    state.options.compared_to === prevState.options.compared_to &&
    !!state.coinData &&
    !!prevState.coinData &&
    prevState.coinData[state.options.compared_to] ===
      state.coinData[state.options.compared_to]
  ) {
    return
  }

  prevState = state

  const beginningPrice =
    state[dataKey][0][getIndexName(state.options.current_index)]

  const series = []

  /**
   * Don't show the last element because sometimes that value is wacky from the server... this should
   * probably be fixed at some point, but for now, we'll just throw it out.
   *  */

  const c50IndexData = [] // The c50IndexData for the chart

  for (let i = 0; i < state[dataKey].length - 1; i++) {
    const summary = state[dataKey][i]
    const timeUnix = dateToUnix(new Date(summary.Date))
    const price =
      (Number(summary[getIndexName(state.options.current_index)]) -
        beginningPrice) /
      beginningPrice

    c50IndexData.push({
      x: timeUnix,
      y: price
    })
  }
  series.push(c50IndexData)

  // render the compared data if it exists
  if (
    !!state.options.compared_to &&
    state.coinData &&
    state.coinData[state.options.compared_to] &&
    c50IndexData.length > 0
  ) {
    const comparedData = []
    const comparedHistory = state.coinData[state.options.compared_to]
    let comparedBeginningPrice = null

    for (const comparedCoin of comparedHistory.sort(
      (a, b) => Number(a.time_unix) - Number(b.time_unix)
    )) {
      if (Number(comparedCoin.time_unix) >= c50IndexData[0].x) {
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
          getIndexName(state.options.current_index)
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
