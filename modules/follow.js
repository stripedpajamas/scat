const state = require('../util/state')
const constants = require('../util/constants')

module.exports = (id, follow) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()

    const following = !!follow

    if (sbot && id) {
      sbot.publish({ type: constants.CONTACT, contact: id, following }, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
