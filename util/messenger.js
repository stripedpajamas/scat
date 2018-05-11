const modules = require('../modules')
const client = require('./client')

const setPrivateRecipients = (line) => new Promise((resolve, reject) => {
  const recipients = line.split(' ')
  if (recipients.length > 6) {
    return reject(new Error('You can only send a private message to up to 7 recipients'))
  }
  const ids = recipients.map(r => client.getAuthorId(r))
  client.setPrivateMode()
  client.setPrivateRecipients(ids)
  resolve()
})

const sendPrivateMessage = (msg) => new Promise((resolve, reject) => {
  return modules.private(msg, client.getPrivateRecipients())
    .catch(() => reject(new Error('Could not send private message')))
})

const sendPublicMessage = (msg) => new Promise((resolve, reject) => {
  return modules.post(msg)
    .catch(() => reject(new Error('Failed to post message')))
})

module.exports = {
  sendMessage: (line) => new Promise((resolve, reject) => {
    if (client.isPrivateMode()) {
      return sendPrivateMessage(line)
    } else if (line[0] === '@') {
      return setPrivateRecipients(line)
    }
    return sendPublicMessage(line)
  })
}
