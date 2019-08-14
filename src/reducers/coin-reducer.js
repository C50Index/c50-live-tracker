import {
  coinUpdateWs,
  loadTrackerSummaryRequestName
} from './initial-loading-reducer.js'
import { createWS } from '../core/services/ws.js'
import { requestAjax } from '../core/services/ajax-service.js'

export function reduceCoins (state, action) {
  let effects = []
  switch (action.type) {
    case 'ws-message':
      if (action.name[0] === coinUpdateWs) {
        const prices = JSON.parse(action.data.data)
        state = { ...state }
        state.coinSummaries = { ...state.coinSummaries }
        for (const slug in state.coinSummaries) {
          if (prices[slug] === state.coinSummaries[slug].previousPrice) continue
          state.coinSummaries[slug] = { ...state.coinSummaries[slug] }
          const previousPrice = state.coinSummaries[slug].price
          state.coinSummaries[slug].previousPrice = previousPrice

          if (prices[slug]) {
            state.coinSummaries[slug].price = prices[slug]
          }
        }
      }
      break

    case 'complete-request':
      if (action.name[0] === loadCoinCapAssetsRequestName) {
        if (action.success) {
          state = { ...state }
          state.coinSummaries = { ...state.coinSummaries }
          const coins = JSON.parse(action.response)
          for (const coin of coins.data) {
            const slug = coin.id
            if (slug) {
              state.coinSummaries[slug] = { ...state.coinSummaries[slug] }
              for (const key in coin) {
                state.coinSummaries[slug][key] = coin[key]
              }
            }
          }

          effects = effects.concat(
            createWS(
              [coinUpdateWs],
              `wss://ws.coincap.io/prices?assets=${Object.keys(
                state.coinSummaries
              ).join(',')}`
            )
          )
        }
      } else if (action.name[0] === loadTrackerSummaryRequestName) {
        // parse csv

        if (action.response) {
          const rows = action.response.split('\n')
          const coinSummaries = {}
          let headers = []
          let startIdx = 0

          // headers
          startIdx = 1
          headers = rows[0].split(',')

          for (let i = startIdx; i < rows.length; i++) {
            if (!rows[i]) continue
            const splitted = rows[i].split(',')

            const row = {}
            headers.map((k, i) => (row[k] = splitted[i]))
            if (row.close) {
              row.price = row.close
              delete row.close
            }
            row.previousPrice = null

            coinSummaries[row.slug] = row
          }

          state = { ...state }
          state.coinSummaries = coinSummaries
          const slugs = Object.keys(state.coinSummaries).join(',')
          effects = effects.concat(loadCoinCapAssets(slugs))
        }
      }
      break
  }
  return {
    state,
    effects
  }
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
