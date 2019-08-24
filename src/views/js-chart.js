const m = window.preact.h
let prevState = null

function renderChart (state) {
  if (!state.c50Summary) return
  if (!state.c50Summary.map) return

  // memoize the state, don't re-render if nothing has changed :)
  if (!!prevState && state.c50Summary === prevState.c50Summary) return
  prevState = state

  const beginningPrice = state.c50Summary[0]['C50Index']

  const data = [] // The data for the chart
  /**
   * Don't show the last element because sometimes that value is wacky from the server... this should
   * probably be fixed at some point, but for now, we'll just throw it out.
   *  */

  for (let i = 0; i < state.c50Summary.length - 1; i++) {
    const summary = state.c50Summary[i]
    data.push({
      x: summary.Date,
      y: (Number(summary['C50Index']) - beginningPrice) / beginningPrice
    })
  }

  return new window.Chartist.Line(
    '.ct-chart',
    { series: [data] },
    {
      showLine: true,
      axisX: {
        showLabel: false,
        offset: 0
      },
      axisY: {
        showLabel: true,
        offset: 0
      }
    }
  )
}

export function JSChart (dispatch) {
  return state => {
    renderChart(state)
    return m('div', { class: 'ct-chart' })
  }
}
