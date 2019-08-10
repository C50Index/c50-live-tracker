export function stringifyArray(array, delimiter) {
  return array.join(delimiter || ":");
}

export function parseStringifiedArray(stringifiedArray, delimiter) {
  return stringifiedArray.split(delimiter || ":");
}
