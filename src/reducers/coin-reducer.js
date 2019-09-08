import { createWS } from '../core/services/ws.js'
import { requestAjax } from '../core/services/ajax-service.js'
import { parseCSV } from '../utils/csv-utils.js'
import { IndexData, RequestName } from '../state.js'

export function updateComparedTo (slug) {
  return {
    type: 'update-compared-to',
    slug
  }
}

export function setCurrentIndex (name) {
  return {
    type: 'set-current-index',
    name
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
      if (action.name[0] === RequestName.wsCoinUpdate) {
        const prices = JSON.parse(action.data.data)
        const key = IndexData[state.options.current_index].summaryKey
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

    case 'set-current-index':
      state = { ...state }
      state.options = { ...state.options }
      state.options.current_index = action.name
      break

    case 'complete-request':
      if (action.name[0] === RequestName.loadCoinCapAssets) {
        if (action.success) {
          const indexName = action.name[1]
          const key = IndexData[indexName].summaryKey

          state = { ...state }
          state[key] = { ...state[key] }
          console.log(
            'original',
            key,
            state[key],
            Object.keys(state[key]).length
          )
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
              [RequestName.wsCoinUpdate],
              `wss://ws.coincap.io/prices?assets=${Object.keys(state[key]).join(
                ','
              )}`
            )
          )
        }
      } else if (action.name[0] === RequestName.loadC50TrackerSummary) {
        // parse tracker summary csv
        if (action.response) {
          state = { ...state }
          state.c50CoinSummaries = parseTrackerSummary(action.response)

          const slugs = Object.keys(state.c50CoinSummaries).join(',')
          console.log('c50', Object.keys(state.c50CoinSummaries).length)

          effects = effects.concat(loadCoinCapAssets(slugs, 'c50'))
        }
      } else if (action.name[0] === RequestName.loadC20TrackerSummary) {
        // parse tracker summary csv
        if (action.response) {
          state = { ...state }
          state.c20CoinSummaries = parseTrackerSummary(action.response)
          console.log('c20', state.c20CoinSummaries)

          const slugs = Object.keys(state.c20CoinSummaries).join(',')
          effects = effects.concat(loadCoinCapAssets(slugs, 'c20'))
        }
      }
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
export function loadCoinCapAssets (slugs, indexName) {
  const config = {}
  config.url = `https://api.coincap.io/v2/assets?ids=${slugs}`
  config.method = 'get'
  return requestAjax([RequestName.loadCoinCapAssets, indexName], config)
}
