import { dateToUnix } from '../utils/date-utils.js'
import { slugToHuman } from '../utils/slug-utils.js'

const m = window.preact.h
let prevState = null

function renderChart (state) {
  if (!state.c50Summary) return
  if (!state.c50Summary.map) return

  // memoize the state, don't re-render if nothing has changed :)
  if (
    !!prevState &&
    state.c50Summary === prevState.c50Summary &&
    state.comparedTo === prevState.comparedTo &&
    !!state.coinHistories &&
    !!prevState.coinHistories &&
    prevState.coinHistories[state.comparedTo] ===
      state.coinHistories[state.comparedTo]
  ) {
    return
  }

  prevState = state

  const beginningPrice = state.c50Summary[0]['C50Index']

  const series = []

  /**
   * Don't show the last element because sometimes that value is wacky from the server... this should
   * probably be fixed at some point, but for now, we'll just throw it out.
   *  */

  const c50IndexData = [] // The c50IndexData for the chart

  for (let i = 0; i < state.c50Summary.length - 1; i++) {
    const summary = state.c50Summary[i]
    const timeUnix = dateToUnix(new Date(summary.Date))
    const price =
      (Number(summary['C50Index']) - beginningPrice) / beginningPrice

    c50IndexData.push({
      x: timeUnix,
      y: price
    })
  }
  series.push(c50IndexData)

  // render the compared data if it exists
  if (
    state.coinHistories &&
    state.coinHistories[state.comparedTo] &&
    c50IndexData.length > 0
  ) {
    const comparedData = []
    const comparedHistory = state.coinHistories[state.comparedTo]
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
    '.ct-chart',
    {
      series: series
    },
    {
      showLine: true,

      axisX: {
        showLabel: false,
        type: window.Chartist.AutoScaleAxis // This plots an offset for the x
      },
      axisY: {
        showLabel: false
      }
    }
  )
}

export function JSChart (dispatch) {
  return state => {
    renderChart(state)
    return m(
      'div',
      { class: 'container' },
      m(
        'span',
        {},
        m('img', {
          src: `https://cdn.answrly.com/c50/logos/c-c50-logo.png`,
          width: 32,
          height: 32
        }),
        m('span', { style: 'color: #2875e3; font-weight: 700;' }, 'C50Index')
      ),
      ' v ',
      m(
        'span',
        {},
        m('img', {
          src: `https://cdn.answrly.com/c50/coin-images/${
            state.comparedTo
          }.png`
        }),
        m(
          'span',
          { style: 'color: #333333; font-weight: 700;' },
          slugToHuman(state.comparedTo)
        )
      ),
      m('div', { class: 'ct-chart' })
    )
  }
}
