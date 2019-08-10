import { createWS } from "../core/services/ws.js";

export function reduceInitialLoading(state, action) {
    let effects = [];
    switch(action.type) {
        case "init":
            if (state.initialLoad) {
              state = {...state};
              state.initialLoad = false;
              effects = effects.concat(createWS([coinUpdateWs], 'wss://ws.coincap.io/prices?assets=ALL'));
            }
            break;
    }
    return {state, effects};
}

export const coinUpdateWs = 'coin-update-ws';
