
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
  all_slugs:  ["cardano", "aeternity", "basic-attention-token", "bitcoin-diamond", "bitcoin-cash", "bytecoin-bcn", "binance-coin", "bitcoin", "bitcoin-gold", "bytom", "bitshares", "cryptonex", "dash", "dogecoin", "eos", "ethereum-classic", "ethereum", "golem-network-tokens", "holo", "huobi-token", "icon", "iostoken", "chainlink", "lisk", "litecoin", "iota", "nano", "neo", "pundi-x", "omisego", "ontology", "project-pai", "populous", "qtum", "augur", "siacoin", "status", "steem", "stratis", "tron", "wanchain", "waves", "waltonchain", "nem", "stellar", "monero", "ripple", "verge", "zcash", "zilliqa"],
  all_indexes: [ 'c50', 'c20', 'c20Rp', 'aggregateDollar'],
  options: {
    show_graph: true, // Show Coin graph
    show_coin_table: true, // Show coin summary table
    full_screen: true, // Make full screen
    show_header: true, // Show Summary header
    show_c50_index: true, // Show live c50 index number
    show_c50_index_image: false, // Show Image next to c50 index
    compared_to: '', // What we are comparing the c50index to
    current_index: 'c20',
    show_technical_indicators: false,
    show_selector: false,
  }
}

export const IndexData = {
  c50: {
    divisorType: 'market_weighted', // market_weighted | price_weighted
    summaryKey: 'c50CoinSummaries',
    numeratorKey: 'marketcap',
    divisor: 217699185.83,
    chartDataKey: 'c50ChartData',
    name: 'C50Index', // The csv header name from the rails server
    displayName: 'C50 Index'
  },
  c20: {
    divisorType: 'market_weighted', // market_weighted | price_weighted
    summaryKey: 'c20CoinSummaries',
    numeratorKey: 'marketcap',
    divisor: 25374076.22,
    chartDataKey: 'c20ChartData',
    name: 'C20Index', // The csv header name from the rails server for the chart data
    displayName: 'C20 Index'
  },
  aggregateDollar: {
    divisorType: 'price_weighted', // market_weighted | price_weighted
    summaryKey: 'aggregateDollarSummaries',
    numeratorKey: 'price',
    divisor: 3.0,
    chartDataKey: 'aggregateDollarChartData',
    name: 'AggregateDollarIndex', // The csv header name from the rails server
    displayName: 'Aggregate Dollar Index'
  },
  c20Rp: {
    divisorType: 'price_weighted', // market_weighted | price_weighted
    summaryKey: 'c20RPSummaries',
    numeratorKey: 'marketcap',
    divisor: 11672777.14,
    chartDataKey: 'c20RpChartData',
    name: 'C20RiskParity', // The csv header name from the rails server for the chart data
    displayName: 'C20 Risk Parity',
    slugToPercent: {
      cardano: 4.37,
      'bitcoin-cash': 3.61,
      'binance-coin': 5.28,
      'bitcoin-sv': 2.52,
      bitcoin: 5.46,
      dash: 4.2,
      eos: 3.82,
      'ethereum-classic': 4.3,
      ethereum: 4.53,
      leocoin: 14.05,
      chainlink: 4.73,
      litecoin: 4.21,
      iota: 5.24,
      maker: 5.03,
      neo: 3.86,
      tron: 3.88,
      stellar: 5.07,
      monero: 4.88,
      ripple: 5.45,
      tezos: 5.5,
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
