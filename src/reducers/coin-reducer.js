import {
  coinUpdateWs,
  loadC50TrackerSummaryRequestName,
  loadC20TrackerSummaryRequestName
} from './initial-loading-reducer.js'
import { createWS } from '../core/services/ws.js'
import { requestAjax } from '../core/services/ajax-service.js'
import { parseCSV } from '../utils/csv-utils.js'
import { CoinSummaryKey } from '../state.js'

export function updateComparedTo (slug) {
  return {
    type: 'update-compared-to',
    slug
  }
}

function parseTrackerSummary (response) {
  // parse tracker summary csv
  if (response) {
    const coinSummaries = parseCSV(response, {
      headers: true
    }).reduce((summary, row) => {
      if (!row) return summary
      row.price = row.close
      delete row.close
      delete row.marketcap
      row.previousPrice = null

      summary[row.slug] = row

      return summary
    }, {})
    return coinSummaries
  }
}

export function reduceCoins (state, action) {
  let effects = []
  switch (action.type) {
    case 'ws-message':
      if (action.name[0] === coinUpdateWs) {
        const prices = JSON.parse(action.data.data)
        const key = CoinSummaryKey[state.currentIndex]
        state = { ...state }
        state[key] = { ...state[key] }
        console.log('Count', key, Object.keys(state[key]).length)
        for (const slug in state[key]) {
          if (prices[slug] === state[key][slug].previousPrice) continue
          state[key][slug] = { ...state[key][slug] }
          const previousPrice = state[key][slug].price
          state[key][slug].previousPrice = previousPrice

          if (prices[slug]) {
            state[key][slug].price = prices[slug]
            state[key][slug].marketcap = prices[slug] * state[key][slug].supply
          }
        }
      }
      break

    case 'complete-request':
      if (action.name[0] === loadCoinCapAssetsRequestName) {
        if (action.success) {
          const key = CoinSummaryKey[state.currentIndex]

          state = { ...state }
          state[key] = { ...state[key] }
          console.log('original', state[key], Object.keys(state[key]).length)
          const coins = JSON.parse(action.response)
          for (const coin of coins.data) {
            const slug = coin.id
            if (slug && state[key][slug]) {
              state[key][slug] = { ...state[key][slug] }
              for (const slugKey in coin) {
                state[key][slug][slugKey] = coin[slugKey]
              }
              state[key][slug].marketcap =
                Number(coin['supply']) * Number(coin['priceUsd'])
            }
          }

          effects = effects.concat(
            createWS(
              [coinUpdateWs],
              `wss://ws.coincap.io/prices?assets=${Object.keys(state[key]).join(
                ','
              )}`
            )
          )
        }
      } else if (action.name[0] === loadC50TrackerSummaryRequestName) {
        // parse tracker summary csv
        if (action.response) {
          state = { ...state }
          state.c50CoinSummaries = parseTrackerSummary(action.response)

          const slugs = Object.keys(state.c50CoinSummaries).join(',')
          console.log('c50', state.c50CoinSummaries)

          effects = effects.concat(loadCoinCapAssets(slugs))
        }
      } else if (action.name[0] === loadC20TrackerSummaryRequestName) {
        // parse tracker summary csv
        if (action.response) {
          state = { ...state }
          state.c20CoinSummaries = parseTrackerSummary(action.response)
          console.log('c20', state.c20CoinSummaries)

          const slugs = Object.keys(state.c20CoinSummaries).join(',')
          effects = effects.concat(loadCoinCapAssets(slugs))
        }
      } else if (action.name[0] === loadCoinHistoryRequestName) {
        if (action.success) {
          const slug = action.name[1]
          state = { ...state }
          state.coinHistories = { ...state.coinHistories }
          state.coinHistories[slug] = parseCSV(action.response, {
            headers: true
          })
        }
      }
      break

    case 'update-compared-to':
      ;({ state, effects } = setupComparedToCoin(action.slug, state))

      break
  }
  return {
    state,
    effects
  }
}

export function setupComparedToCoin (slug, state) {
  let effects = []
  state = { ...state }
  state.options = { ...state.options }
  state.options.compared_to = slug

  // Don't reload the data if we already have it
  if (slug && !state.coinHistories[state.options.compared_to]) {
    effects = effects.concat(loadCoinHistory(slug))
  }
  return { state, effects }
}

/**
 *
 * @param {*} slugs
 */

export function loadCoinHistory (slug) {
  const config = {}
  config.url = `https://cdn.answrly.com/c50/all-coins/${slug}.csv`
  config.method = 'get'

  return requestAjax([loadCoinHistoryRequestName, slug], config)
}

/**
 * https://api.coincap.io/v2/assets?ids=bitcoin,ethereum
 * @param {*} slugs comman seperated list of coin slugs
 */
export function loadCoinCapAssets (slugs) {
  const config = {}
  config.url = `https://api.coincap.io/v2/assets?ids=${slugs}`
  config.method = 'get'
  return requestAjax([loadCoinCapAssetsRequestName], config)
}

export const loadCoinCapAssetsRequestName = 'load-coincap-assets'
export const loadCoinHistoryRequestName = 'load-coin-history'
