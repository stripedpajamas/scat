const client = require('../util/client')
const constants = require('../util/constants')

module.exports = (text, recipients) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    const me = client.getMe()

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
