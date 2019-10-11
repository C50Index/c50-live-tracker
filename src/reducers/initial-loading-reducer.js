import { requestAjax } from '../core/services/ajax-service.js'
import {
  loadCoinHistory,
  loadAggregateDollarChartData,
  loadC50ChartData,
  loadC20ChartData
} from './chart-reducer.js'
import { RequestName } from '../state.js'

export function reduceInitialLoading (state, action) {
  let effects = []
  switch (action.type) {
    case 'init':
      if (state.initialLoad) {
        state = { ...state }
        state.initialLoad = false
        effects = effects.concat(loadc50TrackerSummary())
        effects = effects.concat(loadc20TrackerSummary())
        effects = effects.concat(loadAggregateDollarTrackerSummary())
        effects = effects.concat(loadC20ChartData())
        effects = effects.concat(loadC50ChartData())
        effects = effects.concat(loadAggregateDollarChartData())
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
  return requestAjax([RequestName.loadC50TrackerSummary], config)
}

export function loadc20TrackerSummary () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c20-tracker-summary.csv'
  config.method = 'get'
  return requestAjax([RequestName.loadC20TrackerSummary], config)
}

export function loadAggregateDollarTrackerSummary () {
  const config = {}
  config.url =
    'https://cdn.answrly.com/c50/all-coins/aggregate-dollar-index-tracker-summary.csv'

  config.method = 'get'
  return requestAjax([RequestName.loadAggregateDollarTrackerSummary], config)
}
