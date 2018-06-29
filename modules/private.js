const state = require('../util/state')
const constants = require('../util/constants')

module.exports = ({ text, recipients, action }) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    const root = state.getPrivateMessageRoot() || undefined
    // if we have the root, other ssb clients should see private chats grouped together

    // recipients always has me because it's populated by state.privateRecipients
    // so we shouldn't have any issue with not being able to read our own chats

    if (sbot && text) {
      sbot.private.publish({
        type: constants.MESSAGE_TYPE,
        text,
        recps: recipients,
        action,
        root
      }, recipients, (err, msg) => {
        if (err) return reject(err)
        resolve(msg)
      })
    }
  })
}
