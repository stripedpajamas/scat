const constants = require('./constants')
const client = require('./client')
const modules = require('../modules')
const ui = require('./ui')

const processor = (msg) => {
  const m = msg.value
  const me = client.getMe()

  if (m && m.content) {
    // first see if we are dealing with an encrypted message
    if (typeof m.content === 'string') {
      modules.unbox(m.content)
        .then((content) => {
          const decryptedMsg = msg
          decryptedMsg.value.content = content
          decryptedMsg.value.private = true // so we can alter the ui
          return processor(decryptedMsg)
        })
        .catch(() => {}) // ignore failure to decrypt private messages
    }
    switch (m.content.type) {
      case constants.ABOUT:
        if (m.content.about && m.content.name) {
          // only honor self-identification or my own identification of someone else
          if (m.author === m.content.about || m.author === me) {
            client.setAuthor(m.content.about, m.content.name, m.author)
          }
        }
        break
      case constants.MESSAGE_TYPE:
        if (m.author === me) {
          ui.printSelfMsg(m)
        } else {
          ui.printMsg(m)
        }
        break
      default:
        break
    }
  }
}

module.exports = processor
