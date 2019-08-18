const m = window.preact.h

export function JSChart (dispatch) {
  return state => {
    return m('canvas', { id: 'chart', style: 'width: 100%; height: 100%' })
  }
}
// function drawChart (slug) {
//   let chartInstance = null
//   let c50beginningPrice = null
//   let comparedMarketCap = null
//   let startTimeUnix = 1483196400 // 1/1/2017

//   let startDate = moment()
//     .year(2017)
//     .startOf('year')

//   let container = docum
//   let container = document.getElementById('chartcontainer')
//   container.innerHTML =
//     "<canvas id='chart' style='width: 100%; height: 100%;'></canvas>"
//   var ctx = document.getElementById('chart').getContext('2d')
//   if (chartInstance) chartInstance.destroy()

//   chartInstance = new Chart(ctx, {
//     type: 'line',
//     data: data,
//     options: {
//       scales: {
//         responsive: true,
//         maintainAspectRatio: false,
//         xAxes: [
//           {
//             type: 'time',
//             time: { unit: 'month' },
//             distribution: 'series'
//           }
//         ],
//         yAxes: [
//           {
//             scaleLabel: {
//               display: true,
//               labelString: 'Normalized C50 Index %'
//             }
//           }
//         ]
//       },
//       tooltips: {
//         callbacks: {
//           title: function (item, data) {
//             var date = item.xLabel
//             return new moment(date)
//           },
//           label: function (item, data) {
//             var datasetLabel = data.datasets[item.datasetIndex].label || ''
//             var date = item.xLabel
//             var value = item.yLabel
//             if (datasetLabel === slug) {
//               return (
//                 datasetLabel +
//                 ': $' +
//                 (value * comparedMarketCap).toLocaleString()
//               )
//             } else {
//               return (
//                 datasetLabel +
//                 ': ' +
//                 (value * c50beginningPrice).toLocaleString()
//               )
//             }
//           }
//         }
//       }
//     }
//   })
// }

// readCSV('https://cdn.answrly.com/c50/all-coins/c50-index.csv', {
//   headers: true
// })
//   .then(rows => {
//     // Date: "2016-12-30", C50Index: "101.21617490463628", market_weighted_divisor: "17019127036.0"
//     return rows
//   })
//   .then(c50IndexData => {
//     readCSV(`https://cdn.answrly.com/c50/all-coins/${slug}.csv`, {
//       headers: true
//     }).then(rows => {
//       // calculate c50 index and normalize
//       let c50Index = c50IndexData.map(o => {
//         let time = new moment(o['Date'])
//         if (!c50beginningPrice) c50beginningPrice = Number(o['C50Index'])
//         return {
//           x: time,
//           y: (Number(o['C50Index']) - c50beginningPrice) / c50beginningPrice
//         }
//       })

//       rows
//         .sort((a, b) => Number(a['time_unix']) - Number(b['time_unix']))
//         .filter(r => {
//           if (!comparedMarketCap && Number(r['time_unix']) >= startTimeUnix) {
//             comparedMarketCap = Number(r['marketcap'])
//             return true
//           } else {
//             return false
//           }
//         })[0]['close']

//       let sortedComparedRows = rows.sort(
//         (a, b) => Number(a['time_unix']) - Number(b['time_unix'])
//       )

//       let comparedData = sortedComparedRows
//         .map(o => {
//           let time = new moment(o['time_unix'], 'X')
//           let normalizedPrice =
//             (Number(o['marketcap']) - comparedMarketCap) / comparedMarketCap

//           if (time.unix() >= startTimeUnix && !!normalizedPrice) {
//             console.log(normalizedPrice)
//             return { x: time, y: normalizedPrice }
//           } else {
//             return false
//           }
//         })
//         .filter(x => x)

//       // view-source:http://www.chartjs.org/samples/latest/scales/time/financial.html
//       let dataStyles = {
//         pointRadius: 0,
//         fill: true,
//         type: 'line',
//         lineTension: 0,
//         borderWidth: 2
//       }

//       draw({
//         datasets: [
//           {
//             label: slug,
//             data: comparedData,
//             backgroundColor: 'rgba(188,188,163,.6)',
//             ...dataStyles
//           },
//           {
//             label: 'C50 Index',
//             data: c50Index,
//             backgroundColor: '#2875e3',
//             ...dataStyles
//           }
//         ]
//       })
//     })
//   })
