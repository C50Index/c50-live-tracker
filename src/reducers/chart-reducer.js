import { requestAjax } from '../core/services/ajax-service.js'
import { RequestName } from '../state.js'
import { parseCSV } from '../utils/csv-utils.js'

export function reduceChart (state, action) {
  let effects = []

  switch (action.type) {
    case 'complete-request':
      if (action.name[0] === RequestName.loadCoinHistory) {
        if (action.success) {
          const slug = action.name[1]
          state = { ...state }
          state.coinData = { ...state.coinData }
          state.coinData[slug] = parseCSV(action.response, {
            headers: true
          })
        }
      } else if (action.name[0] === RequestName.loadC50Data) {
        if (action.success) {
          state = { ...state }
          state.c50Data = { ...state.c50Data }
          state.c50Data = parseCSV(action.response, {
            headers: true
          })
        }
      } else if (action.name[0] === RequestName.loadC20Data) {
        if (action.success) {
          state = { ...state }
          state.c20Data = { ...state.c20Data }
          state.c20Data = parseCSV(action.response, {
            headers: true
          })
        }
      }

      break

    case 'update-compared-to':
      ;({ state, effects } = setupComparedToCoin(action.slug, state))

      break
  }
  return { state, effects }
}

export function setupComparedToCoin (slug, state) {
  let effects = []
  state = { ...state }
  state.options = { ...state.options }
  state.options.compared_to = slug

  // Don't reload the data if we already have it
  if (slug && !state.coinData[state.options.compared_to]) {
    effects = effects.concat(loadCoinHistory(slug))
  }
  return { state, effects }
}

/**
 * Get the coin history for a slug
 * @param {*} slugs
 */
export function loadCoinHistory (slug) {
  const config = {}
  config.url = `https://cdn.answrly.com/c50/all-coins/${slug}.csv`
  config.method = 'get'

  return requestAjax([RequestName.loadCoinHistory, slug], config)
}

export function loadC20Data () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c20-index.csv'
  config.method = 'get'
  return requestAjax([RequestName.loadC20Data], config)
}

export function loadC50Data () {
  const config = {}
  config.url = 'https://cdn.answrly.com/c50/all-coins/c50-index.csv'
  config.method = 'get'
  return requestAjax([RequestName.loadC50Data], config)
}
