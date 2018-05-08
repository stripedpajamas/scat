const ref = require('ssb-ref')
const client = require('../util/client')
const constants = require('../util/constants')

module.exports = (text, recipients) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    const me = client.getMe()

    // make sure we can read the message
    recipients.push(me)
    // convert any friendly names to ids
    recipients = recipients.map(name => ref.isFeedId(name) ? name : client.getAuthorId(name))

    if (sbot && text) {
      sbot.private.publish({ type: constants.MESSAGE_TYPE, text }, recipients, (err, msg) => {
        if (err) return reject(err)
        resolve(msg)
      })
    }
  })
}
