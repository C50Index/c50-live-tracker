import { requestAjax } from '../core/services/ajax-service.js'
import { loadCoinHistory } from './coin-reducer.js'

export function reduceInitialLoading (state, action) {
  let effects = []
  switch (action.type) {
    case 'init':
      if (state.initialLoad) {
        state = { ...state }
        state.initialLoad = false
        effects = effects.concat(loadc50TrackerSummary())
        effects = effects.concat(loadc20TrackerSummary())
        if (state.options.compared_to) {
          effects = effects.concat(loadCoinHistory(state.options.compared_to))
        }
      }
      break
  }
  return { state, effects }
}

export function loadc50TrackerSummary () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c50-tracker-summary.csv'
  config.method = 'get'
  return requestAjax([loadC50TrackerSummaryRequestName], config)
}

export function loadc20TrackerSummary () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c20-tracker-summary.csv'
  config.method = 'get'
  return requestAjax([loadC20TrackerSummaryRequestName], config)
}

export const coinUpdateWs = 'coin-update-ws'
export const loadC50TrackerSummaryRequestName = 'load-c50-tracker-summary'
export const loadC20TrackerSummaryRequestName = 'load-c20-tracker-summary'
