const modules = require('../modules')
const state = require('./state')

const sendPrivateMessage = ({ text, action }) => new Promise((resolve, reject) => {
  return modules.private({ text, recipients: state.getPrivateRecipients(), action })
    .catch(() => reject(new Error('Could not send private message')))
})

const sendPublicMessage = ({ text, action }) => new Promise((resolve, reject) => {
  return modules.post({ text, action })
    .catch(() => reject(new Error('Failed to post message')))
})

module.exports = {
  sendMessage: (text) => {
    if (state.isPrivateMode()) {
      return sendPrivateMessage({ text })
    }
    return sendPublicMessage({ text })
  },
  sendAction: (text) => {
    if (state.isPrivateMode()) {
      return sendPrivateMessage({ text, action: true })
    }
    return sendPublicMessage({ text, action: true })
  }
}
