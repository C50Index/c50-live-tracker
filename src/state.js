export const initialState = {
  initialLoad: true,
  coinSummaries: {}, // close: "0.09682", marketcap: "2510251344.0" name: "Cardano", slug: "cardano", symbol: "cardano"
  c50Summary: {},
  comparedTo: 'bitcoin', // What we are comparing the c50index to
  coinHistories: {} // loaded from https://cdn.answrly.com/c50/all-coins/{slug}.csv
}
