import { loadCoinHistory } from "./chart-reducer.js";
import { sequence } from "../core/reducers.js";

export function updateSelection(key, value) {
  return {
    type: 'update-selection',
    key,
    value
  }
}

export function reduceTechnicalIndicators (state, action) {
  let effects = []

  switch (action.type) {
    case 'update-selection':
      state = {...state};
      state.options = {...state.options};
      state.options[action.key] = action.value;
      if (action.key === 'compared_to' && !state.coinData[action.value]) {
        effects = sequence(effects, loadCoinHistory(action.value));
      } 
      break;
  }
  return {state, effects};
}
