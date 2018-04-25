const client = require('../util/client')
const constants = require('../util/constants')

module.exports = (name) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    const me = client.getMe()

    if (sbot && me && name) {
      sbot.publish({ type: constants.ABOUT, about: me, name }, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
