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
          client.setAuthor(m.content.about, m.content.name)
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
