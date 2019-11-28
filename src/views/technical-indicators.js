import { IndexData } from '../state.js'
import { simpleMovingAverage, rowsToPrices, allTechnicalIndicators } from '../utils/technical-indicators.js';
const m = window.preact.h

let prevState = null
export function TechnicalIndicators(dispatch) {

  return (state) => {
    const indexData = IndexData[state.options.current_index]
    const chartDataKey = indexData.chartDataKey;
    const chartData = state[chartDataKey];
    return;


    if(!chartData || Object.keys(chartData).length === 0) return;
      if (
        !!prevState &&
        state[chartDataKey] === prevState[chartDataKey] //&&
        // state.options.compared_to === prevState.options.compared_to &&
        // !!state.coinData &&
        // !!prevState.coinData &&
        // prevState.coinData[state.options.compared_to] ===
        //   state.coinData[state.options.compared_to] &&
        // state.options.current_index === prevState.options.current_index
      ) {
        return
      }
      console.log("state", state)
      console.log("prevState", prevState)
      prevState = state;
      console.log("chartDataKey", chartDataKey)
    // console.log("chartData", chartData.length)
    
    const indexIndicators = allTechnicalIndicators(chartData, {dateKey: 'Date', priceKey: indexData.name})
    return m('div', {
      class: 'tc'
    }, 
      // indexIndicators.map((indicator) => m('div', {}, m('span', {},
      //    indicator.name +" : " +  indicator.signal + " " + indicator.value)
      // ))
    )
  }
}