import { IndexData } from '../state.js'
import { allTechnicalIndicators } from '../utils/technical-indicators.js';
import { slugToHuman } from '../utils/slug-utils.js';
import { updateSelection } from '../reducers/technical-indicators-reducer.js';
import { SelectSingle } from '../components/select-single.js';
const m = window.preact.h

export function TechnicalIndicators(dispatch) {
  let dispatcher = {
    updateSelection: (key, value)  => dispatch(updateSelection(key, value)),
  }

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
    return m('div', {},
      state.options.show_selector && m('div', {class: 'w-100 flex'}, 
        SelectSingle(state.options.current_index, 
          state.all_indexes.map((index) => {return {value: index, label: slugToHuman(index)}}),
          (value) => dispatcher.updateSelection('current_index', value)
        ),
        SelectSingle(state.options.compared_to, 
          state.all_slugs.map((slug) => {return {value: slug, label: slugToHuman(slug)}}),
          (value) => dispatcher.updateSelection('compared_to', value)
        ),
      ), 
      m('div', {class: 'flex w-100'},
        indexIndicators && displayIndicators(indexData.displayName, indexIndicators),
        comparedToIndicators && displayIndicators(slugToHuman(state.options.compared_to), comparedToIndicators)
      )
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
// localhost:8000?current_index=c50&compared_to=bitcoin&show_technical_indicators=true&full_screen=true&show_graph=false&show_coin_table=false&full_screen=true&show_header=false&show_c50_index=false