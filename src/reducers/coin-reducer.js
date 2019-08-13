import {
  coinUpdateWs,
  loadTrackerSummaryRequestName
} from './initial-loading-reducer.js'

export function reduceCoins (state, action) {
  const effects = []
  switch (action.type) {
    case 'ws-message':
      if (action.name[0] === coinUpdateWs) {
        const prices = JSON.parse(action.data.data)
        state = { ...state }
        state.coinSummaries = { ...state.coinSummaries }
        for (const slug in prices) {
          if (state.coinSummaries[slug]) {
            state.coinSummaries[slug] = { ...state.coinSummaries[slug] }
            state.coinSummaries[slug].price = prices[slug]
          }
        }
      }
      break

    case 'complete-request':
      if (action.name[0] === loadTrackerSummaryRequestName) {
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
        }
      }
      break
  }
  return {
    state,
    effects
  }
}
