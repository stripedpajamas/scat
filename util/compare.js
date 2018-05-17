// to check if 2 flat arrays contain the same values, regardless of order
module.exports = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }
  const a = arr1.slice().sort()
  const b = arr2.slice().sort()
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
