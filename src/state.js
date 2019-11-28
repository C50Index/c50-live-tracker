export const initialState = {
  initialLoad: true,
  c50CoinSummaries: {}, // close: "0.09682", marketcap: "2510251344.0" name: "Cardano", slug: "cardano", symbol: "cardano"
  c20CoinSummaries: {}, // close: "0.09682", marketcap: "2510251344.0" name: "Cardano", slug: "cardano", symbol: "cardano"
  aggregateDollarSummaries: {},
  c20RPSummaries: {},
  c50ChartData: {}, // The data to show on the graph
  c20ChartData: {}, // The data to show on the graph
  aggregateDollarChartData: {}, // Data to show on the chart
  c20RpChartData: {}, // Data to show on the chart
  coinData: {}, // loaded from https://cdn.answrly.com/c50/all-coins/{slug}.csv
  options: {
    show_graph: true, // Show Coin graph
    show_coin_table: true, // Show coin summary table
    full_screen: true, // Make full screen
    show_header: true, // Show Summary header
    show_c50_index: true, // Show live c50 index number
    show_c50_index_image: false, // Show Image next to c50 index
    compared_to: '', // What we are comparing the c50index to
    current_index: 'c20',
    show_technical_indicators: true
  }
}

export const IndexData = {
  c50: {
    divisorType: 'market_weighted', // market_weighted | price_weighted
    summaryKey: 'c50CoinSummaries',
    numeratorKey: 'marketcap',
    divisor: 214570583.32,
    chartDataKey: 'c50ChartData',
    name: 'C50Index', // The csv header name from the rails server
    displayName: 'C50 Index'
  },
  c20: {
    divisorType: 'market_weighted', // market_weighted | price_weighted
    summaryKey: 'c20CoinSummaries',
    numeratorKey: 'marketcap',
    divisor: 24359904.42,
    chartDataKey: 'c20ChartData',
    name: 'C20Index', // The csv header name from the rails server for the chart data
    displayName: 'C20 Index'
  },
  aggregateDollar: {
    divisorType: 'price_weighted', // market_weighted | price_weighted
    summaryKey: 'aggregateDollarSummaries',
    numeratorKey: 'price',
    divisor: 4.0,
    chartDataKey: 'aggregateDollarChartData',
    name: 'AggregateDollarIndex', // The csv header name from the rails server
    displayName: 'Aggregate Dollar Index'
  },
  c20Rp: {
    divisorType: 'price_weighted', // market_weighted | price_weighted
    summaryKey: 'c20RPSummaries',
    numeratorKey: 'marketcap',
    divisor: 14064715.568343,
    chartDataKey: 'c20RpChartData',
    name: 'C20RiskParity', // The csv header name from the rails server for the chart data
    displayName: 'C20 Risk Parity',
    slugToPercent: {
      cardano: 4.48,
      'bitcoin-cash': 3.79,
      'binance-coin': 6.07,
      'bitcoin-sv': 4.15,
      bitcoin: 6.42,
      dash: 5.07,
      eos: 4.35,
      'ethereum-classic': 5.16,
      ethereum: 4.74,
      chainlink: 5.05,
      litecoin: 4.65,
      iota: 4.94,
      maker: 5.58,
      neo: 4.34,
      tron: 4.87,
      nem: 5.19,
      stellar: 5.14,
      monero: 4.97,
      ripple: 5.78,
      tezos: 5.2
    }
  }
}

export const RequestName = {
  loadCoinCapAssets: 'load-coincap-assets',
  loadCoinHistory: 'load-coin-history',
  loadC50ChartData: 'load-c50-data',
  loadC20ChartData: 'load-c20-data',
  loadAggregateDollarChartData: 'load-aggregate-dollar-data',
  loadC20RpChartData: 'load-c20-rp-chart-data',
  loadC50TrackerSummary: 'load-c50-tracker-summary',
  loadC20TrackerSummary: 'load-c20-tracker-summary',
  wsCoinUpdate: 'coin-update-ws',
  loadAggregateDollarTrackerSummary: 'load-aggregate-dollar-tracker-summary',
  loadC20RPTrackerSummary: 'load-c20-rp-tracker-summary'
}
