const constants = require('./constants')
const client = require('./client')
const ui = require('./ui')

module.exports = (msg) => {
  const m = msg.value
  const me = client.getMe()

  if (m && m.content) {
    switch (m.content.type) {
      case constants.ABOUT:
        if (m.content.about && m.content.name) {
          // only honor self-identification or my own identification of someone else
          if (m.author === m.content.about || m.author === me) {
            client.setAuthor(m.content.about, m.content.name)
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
