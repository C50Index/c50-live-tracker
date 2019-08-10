import { coinUpdateWs } from "./initial-loading-reducer.js";

export function reduceCoins(state, action) {
  let effects = [];
  switch (action.type) {
    case "ws-message":
      if(action.name[0] === coinUpdateWs) {
        let prices = JSON.parse(action.data.data);
        state = {...state};
        state.prices = {...state.prices, ...prices};
      }
      break;
  }
  return {
    state,
    effects
  };
}

