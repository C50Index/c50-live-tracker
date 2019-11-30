import { IndexData } from '../state.js'
import { allTechnicalIndicators } from '../utils/technical-indicators.js';
import { slugToHuman } from '../utils/slug-utils.js';
const m = window.preact.h

export function TechnicalIndicators(dispatch) {
  return (state) => {
    if(!(!!state.options.current_index && !!state.options.compared_to)) return;

    let indexIndicators = null;
    const indexData = IndexData[state.options.current_index]
    
    if(indexData && indexData.chartDataKey && state[indexData.chartDataKey ]) {
      indexIndicators = allTechnicalIndicators(state[indexData.chartDataKey ], {dateKey: 'Date', priceKey: indexData.name})
    }

    let comparedToIndicators = null;
    const comparedToData = state.coinData[state.options.compared_to];
    if(comparedToData) {
      comparedToIndicators = allTechnicalIndicators(comparedToData);
    }
    
    return m('div', {class: 'flex'},
      indexIndicators && displayIndicators(indexData.displayName, indexIndicators),
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