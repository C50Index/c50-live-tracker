import { IndexData } from '../state.js'
import { allTechnicalIndicators } from '../utils/technical-indicators.js';
import { slugToHuman } from '../utils/slug-utils.js';
const m = window.preact.h

export function TechnicalIndicators(dispatch) {
  return (state) => {
    const indexData = IndexData[state.options.current_index]
    const chartDataKey = indexData.chartDataKey;
    const data = state[chartDataKey];
    if(!data || Object.keys(data).length === 0) return m('div', {}, '');

    const indexIndicators = allTechnicalIndicators(data, {dateKey: 'Date', priceKey: indexData.name})
    let comparedToIndicators = null;
    let comparedToData = state.coinData[state.options.compared_to];
    if(comparedToData) {
      comparedToIndicators = allTechnicalIndicators(comparedToData);
    }
    
    return m('div', {class: 'flex'},

      displayIndicators(indexData.displayName, indexIndicators),
      comparedToIndicators && displayIndicators(slugToHuman(state.options.compared_to), comparedToIndicators)
    )
  }
}

function displayIndicators(name, indicators) {
  return m('div', {},
    m('h2', {class: ''}, `${name} Indicators`),
    m('table', {class: 'table table-bordered'}, 
      indicators.map((indicator) => {
        return m('tr', {},
          m('td', {class: 'f7'}, indicator.name),
          m('td', {}, indicator.value),
        )
      })  
    )
  )
}