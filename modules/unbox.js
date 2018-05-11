const state = require('../util/state')

module.exports = (enc) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    if (sbot && enc) {
      sbot.private.unbox(enc, (err, content) => {
        if (err) return reject(err)
        resolve(content)
      })
    }
  })
}
