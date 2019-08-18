/**
 * options:
 *  - headers : true / false
 *     - if true -> returns objects with headerName -> value
 *     - else returns string[][]
 */
export function parseCSV (rawData, options = {}) {
  const rows = rawData.split('\n')
  const result = []
  let headers = []
  let startIdx = 0
  if (options.headers) {
    startIdx = 1
    headers = rows[0].split(',')
  }

  for (let i = startIdx; i < rows.length; i++) {
    if (!rows[i]) continue
    const splitted = rows[i].split(',')

    if (options.headers) {
      const row = {}
      headers.map((k, i) => (row[k] = splitted[i]))
      result.push(row)
    } else {
      result.push(splitted)
    }
  }
  return result
}
