export const initialState = {
  initialLoad: true,
  c50CoinSummaries: {}, // close: "0.09682", marketcap: "2510251344.0" name: "Cardano", slug: "cardano", symbol: "cardano"
  c20CoinSummaries: {}, // close: "0.09682", marketcap: "2510251344.0" name: "Cardano", slug: "cardano", symbol: "cardano"
  c50Data: {}, // The data to show on the graph
  c20Data: {}, // The data to show on the graph
  coinData: {}, // loaded from https://cdn.answrly.com/c50/all-coins/{slug}.csv
  options: {
    show_graph: true, // Show Coin graph
    show_coin_table: true, // Show coin summary table
    full_screen: true, // Make full screen
    show_header: true, // Show Summary header
    show_c50_index: true, // Show live c50 index number
    show_c50_index_image: false, // Show Image next to c50 index
    compared_to: '', // What we are comparing the c50index to
    current_index: 'c20'
  }
}

export const IndexData = {
  c50: {
    summaryKey: 'c50CoinSummaries',
    marketWeightedDivisor: 214570583.32,
    dataKey: 'c50Data',
    name: 'C50Index'
  },
  c20: {
    summaryKey: 'c20CoinSummaries',
    marketWeightedDivisor: 24359904.42,
    dataKey: 'c20Data',
    name: 'C20Index'
  }
}

export const RequestName = {
  loadCoinCapAssets: 'load-coincap-assets',
  loadCoinHistory: 'load-coin-history',
  loadC50Data: 'load-c50-data',
  loadC20Data: 'load-c20-data',
  loadC50TrackerSummary: 'load-c50-tracker-summary',
  loadC20TrackerSummary: 'load-c20-tracker-summary',
  wsCoinUpdate: 'coin-update-ws'
}
