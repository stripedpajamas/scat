const ref = require('ssb-ref')
const state = require('./state')
const modules = require('../modules')

const commands = {
  // /pub invite-code
  '/pub': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To join a pub: /pub invite-code')
    }

    // attempt to join with the supplied invite code
    return modules.invite(line[1])
      .then(() => resolve('Pub joined successfully'))
      .catch(() => reject(new Error('Could not join pub')))
  }),
  // /quit leaves private mode if in it
  '/quit': (line) => new Promise((resolve) => {
    state.setPublicMode()
    return resolve()
  }),
  // /name name
  '/name': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To set your name: /name john')
    }

    return modules.about(line[1])
      .then(() => resolve('Name set successfully'))
      .catch(() => reject(new Error('Could not set name')))
  }),
  '/notifications': () => new Promise((resolve, reject) => {
    const notifications = state.getNotifications().map(state.getAuthor).join('; ')
    const notificationText = `Unread messages from: ${notifications}`
    return resolve(notifications ? notificationText : 'No unread messages')
  }),
  '/clear': () => new Promise((resolve, reject) => {
    state.resetNotifications()
    resolve('Notifications reset')
  }),
  // /help show usage information
  '/help': (line) => new Promise((resolve, reject) => {
    return modules.help()
      .then((info) => resolve(info))
  }),
  // /identify id name
  '/identify': (line) => new Promise((resolve, reject) => {
    if (line.length < 3) {
      return resolve('To personally identify someone else: /identify @id name')
    }

    return modules.about(line[2], line[1])
      .then(() => resolve('Name set successfully'))
      .catch(() => reject(new Error('Could not set name')))
  }),
  // /follow id
  '/follow': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To follow someone: /follow @id')
    }

    return modules.follow(line[1], true)
      .then(() => resolve(`Followed ${line[1]}`))
      .catch(() => reject(new Error(`Could not follow ${line[1]}`)))
  }),
  // /unfollow id
  '/unfollow': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To unfollow someone: /unfollow @id')
    }

    return modules.follow(line[1], false)
      .then(() => resolve(`Unfollowed ${line[1]}`))
      .catch(() => reject(new Error(`Could not unfollow ${line[1]}`)))
  }),
  // /whoami returns my own id
  '/whoami': (line) => new Promise((resolve, reject) => {
    return modules.whoami()
      .then((id) => resolve(id))
      .catch(() => reject(new Error('Could not figure out who you are')))
  }),
  '/private': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return reject(new Error('You must specify recipients: /private @recipient1, @recipient2, ...'))
    }
    const recipients = line.slice(1).join(' ').split(',').map(x => x.trim())
    if (recipients.length > 6) {
      return reject(new Error('You can only send a private message to up to 7 recipients'))
    }
    const ids = recipients.map(r => state.getAuthorId(r))
    if (!ids.every(id => ref.isFeedId(id))) {
      return reject(new Error('Could not determine feed ids for all recipients'))
    }
    state.setPrivateRecipients(ids)
    resolve()
  }),
  // /whois returns the id of an already-identified individual
  '/whois': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To get someone\'s id: /whois name')
    }
    return resolve(state.getAuthorId(line[1]))
  })
}

module.exports = {
  cmd: (input) => new Promise((resolve, reject) => {
    const line = input.split(' ')
    const command = line[0]
    if (typeof commands[command] === 'function') {
      return commands[command](line)
        .then((print) => resolve({ command: true, print }))
        .catch(reject)
    } else if (command[0] === '/') {
      return resolve({ command: false, print: 'Invalid command. Type / and tab to cycle through options.' })
    }
    return resolve({})
  }),
  commands
}
