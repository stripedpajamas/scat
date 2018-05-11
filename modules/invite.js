const state = require('../util/state')

module.exports = (invitation) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    if (sbot && invitation) {
      sbot.invite.accept(invitation, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
