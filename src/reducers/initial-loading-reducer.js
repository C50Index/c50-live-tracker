import { createWS } from '../core/services/ws.js'
import { requestAjax } from '../core/services/ajax-service.js'

export function reduceInitialLoading (state, action) {
  let effects = []
  switch (action.type) {
    case 'init':
      if (state.initialLoad) {
        state = { ...state }
        state.initialLoad = false
        effects = effects.concat(createWS([coinUpdateWs], 'wss://ws.coincap.io/prices?assets=ALL'))
        effects = effects.concat(loadTrackerSummary())
      }
      break
  }
  return { state, effects }
}

export function loadTrackerSummary () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c50-tracker-summary.csv'
  config.method = 'get'
  return requestAjax([loadTrackerSummaryRequestName], config)
}

export const coinUpdateWs = 'coin-update-ws'
export const loadTrackerSummaryRequestName = 'load-tracker-summary'
