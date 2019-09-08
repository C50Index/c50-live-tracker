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
    compared_to: '' // What we are comparing the c50index to
  },
  currentIndex: 'c20' // c20 | c50
}

export const CoinSummaryKey = {
  c50: 'c50CoinSummaries',
  c20: 'c20CoinSummaries'
}

export const DataKey = {
  c50: 'c50Data',
  c20: 'c20Data'
}

export const MarketWeightedDivisor = {
  c50: 214570583.32,
  c20: 24359904.42
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
