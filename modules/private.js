const state = require('../util/state')
const constants = require('../util/constants')

module.exports = (text, recipients) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    const me = state.getMe()

    // make sure we can read the message
    const actualRecipients = recipients.slice()
    actualRecipients.push(me)

    if (sbot && text) {
      sbot.private.publish({ type: constants.MESSAGE_TYPE, text, recipients }, actualRecipients, (err, msg) => {
        if (err) return reject(err)
        resolve(msg)
      })
    }
  })
}
