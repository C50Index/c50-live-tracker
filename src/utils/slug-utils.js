export function slugToHuman (slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map(chunk => chunk[0].toUpperCase() + chunk.substr(1))
    .join(' ')
}
