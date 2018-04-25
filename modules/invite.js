const client = require('../util/client')

module.exports = (invitation) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    if (sbot && invitation) {
      sbot.invite.accept(invitation, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
