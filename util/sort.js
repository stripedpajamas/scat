// sorts by timestamp
module.exports = messages => messages.sort((a, b) => {
  if (a.rawTime < b.rawTime) return -1
  if (a.rawTime > b.rawTime) return 1
  return 0
})
