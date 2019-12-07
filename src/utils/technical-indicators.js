// {name: "Two Hundred Day Moving Average", value: number, signal: "buy" | "sell" | "hold"}

// The prices index=0 equals today
// Sorted from most recent 0 index.  To earliest last index.
export function rowsToPrices(rows, opts={dateKey:'time_unix', priceKey: 'close'}) {
  if(!rows) return [];
  if(!Array.isArray(rows)) return[];
  const rowsCopy = rows.map(e => {return { ...e }}).slice();
  return rowsCopy
    .sort((a, b) => {
      let aDate = opts.dateKey === 'time_unix' ? Number(a[opts.dateKey]) : Number(new Date(a[opts.dateKey]));
      let bDate = opts.dateKey === 'time_unix' ? Number(b[opts.dateKey]) : Number(new Date(b[opts.dateKey]));
      return bDate - aDate;
    })
    .map(r => Number(r[opts.priceKey]))
    .filter(x => x);
}

// Sum up all the close prices divide by 200
export function simpleMovingAverage(prices, days) {
  let sum = 0;
  for(let i = 0 ; i < days; i++) {
    sum += prices[i];
  }

  let result = sum / days;
  return {name: `${days} Day Simple Moving Average`,
          value: result,
          signal:  prices[0] > result ? "buy" : "sell"}
}

// Exponential moving average
export function exponentialMovingAverage(prices, days) {
//   let rows = rows.sort((a, b) => Number(a['time_unix']) - Number(b['time_unix'])).reverse();
// //   EMA = Price(t) * k + EMA(y) * (1 – k)
// // t = today, y = yesterday, N = number of days in EMA, k = 2/(N+1)
  let currentPrice = prices[0];

  prices = prices.slice(0, days).reverse();
  // Make oldest price first, newest price last

  var k = 2 / (days + 1);
  let emaArray = [prices[0]];
  for(let i = 1; i < days; i++) {
    emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
  }

  let result = emaArray[days - 1];
  let signal = currentPrice > result ? "buy" : "sell";

  return {name: `${days} Day Exponential Moving Average`, value: emaArray[days - 1], signal: signal}
}

export function macd(prices) {
  let macd = exponentialMovingAverage(prices, 12).value - exponentialMovingAverage(prices, 26).value;
  let signal = macd > 0 ? "bullish" : "bearish"

  return {name: `MACD`, value: macd, signal: signal}
}

function standardDeviation(prices, days) {
  // if(!days) days = prices.length;
  // let mean = 0;
  // debugger

  // const mean = prices.reduce((sum, curr) => sum + curr, 0) / prices.length;
  // return Math.sqrt(prices.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / prices.length)
}

export function allTechnicalIndicators(rows, opts={dateKey:'time_unix', priceKey: 'close'}) {
  let result = [];
  let prices = rowsToPrices(rows, opts);
  result.push(simpleMovingAverage(prices, 200));
  result.push(simpleMovingAverage(prices, 100));
  result.push(simpleMovingAverage(prices, 50));
  result.push(exponentialMovingAverage(prices, 12));
  result.push(exponentialMovingAverage(prices, 24));
  result.push(exponentialMovingAverage(prices, 90));
  result.push(macd(prices));

  return result;
}