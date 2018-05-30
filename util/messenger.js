const modules = require('../modules')
const state = require('./state')

const sendPrivateMessage = (msg) => new Promise((resolve, reject) => {
  return modules.private(msg, state.getPrivateRecipients())
    .catch(() => reject(new Error('Could not send private message')))
})

const sendPublicMessage = (msg) => new Promise((resolve, reject) => {
  return modules.post(msg)
    .catch(() => reject(new Error('Failed to post message')))
})

module.exports = {
  sendMessage: (line) => {
    if (state.isPrivateMode()) {
      return sendPrivateMessage(line)
    }
    return sendPublicMessage(line)
  }
}
