const state = require('../util/state')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    if (sbot) {
      sbot.whoami((err, id) => {
        if (err) return reject(err)
        resolve(id.id)
      })
    }
  })
}
