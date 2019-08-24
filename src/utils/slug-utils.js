export function slugToHuman (slug) {
  return slug
    .split('-')
    .map(chunk => chunk[0].toUpperCase() + chunk.substr(1))
    .join(' ')
}
