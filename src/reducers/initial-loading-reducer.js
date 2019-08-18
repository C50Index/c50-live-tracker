import { requestAjax } from '../core/services/ajax-service.js'

export function reduceInitialLoading (state, action) {
  let effects = []
  switch (action.type) {
    case 'init':
      if (state.initialLoad) {
        state = { ...state }
        state.initialLoad = false
        effects = effects.concat(loadTrackerSummary())
        effects = effects.concat(loadC50CSV())
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

export function loadC50CSV () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c50-index.csv'
  config.method = 'get'
  return requestAjax([loadC50CSVRequestName], config)
}

export const coinUpdateWs = 'coin-update-ws'
export const loadTrackerSummaryRequestName = 'load-tracker-summary'
export const loadC50CSVRequestName = 'load-c50-csv-request'
