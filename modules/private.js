const state = require('../util/state')
const constants = require('../util/constants')

module.exports = (text, recipients) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()

    // recipients always has me because it's populated by state.privateRecipients

    if (sbot && text) {
      sbot.private.publish({ type: constants.MESSAGE_TYPE, text, recipients }, recipients, (err, msg) => {
        if (err) return reject(err)
        resolve(msg)
      })
    }
  })
}
