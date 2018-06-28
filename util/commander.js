const ref = require('ssb-ref')
const state = require('./state')
const modules = require('../modules')
const messenger = require('./messenger')
const ui = require('./ui')
const Constants = require('./constants')

const commands = {
  // /pub invite-code
  '/pub': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve(Constants.HELP.pub)
    }

    // attempt to join with the supplied invite code
    return modules.invite(line[1])
      .then(() => resolve(Constants.COMMAND_TEXT.PUB.SUCCESS))
      .catch(() => reject(new Error(Constants.COMMAND_TEXT.PUB.FAILURE)))
  }),
  // /quit leaves private mode if in it
  '/quit': (line) => new Promise((resolve) => {
    if (!state.isPrivateMode()) {
      return resolve(Constants.COMMAND_TEXT.QUIT.FROM_PUBLIC)
    }
    state.setPublicMode()
    return resolve()
  }),
  // /name name
  '/name': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve(Constants.HELP.name)
    }

    return modules.about(line[1])
      .then(() => resolve(Constants.COMMAND_TEXT.NAME.SUCCESS))
      .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
  }),
  '/notifications': () => new Promise((resolve, reject) => {
    const notifications = state.getNotifications().map(state.getAuthor).join('; ')
    const notificationText = `Unread messages from: ${notifications}`
    return resolve(notifications ? notificationText : 'No unread messages')
  }),
  '/say': (line) => new Promise((resolve, reject) => {
    const restOfLine = line.slice(1).join(' ')
    // send message
    messenger.sendMessage(restOfLine).catch(ui.printErrMsg)
    resolve()
  }),
  '/clear': () => new Promise((resolve, reject) => {
    state.resetNotifications()
    resolve('Notifications reset')
  }),
  // /help show usage information
  '/help': (line) => new Promise((resolve, reject) => {
    // if no argument passed in, send help summary
    if (line.length < 2) {
      return resolve(Constants.HELP.SUMMARY)
    }

    return resolve(Constants.HELP[line[1]] || Constants.HELP.NOT_FOUND)
  }),
  // /identify id name
  '/identify': (line) => new Promise((resolve, reject) => {
    if (line.length < 3) {
      return resolve(Constants.HELP.identify)
    }

    return modules.about(line[2], line[1])
      .then(() => resolve(Constants.COMMAND_TEXT.NAME.SUCCESS))
      .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
  }),
  // /follow id
  '/follow': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve(Constants.HELP.follow)
    }

    return modules.follow(line[1], true)
      .then(() => resolve(`Followed ${line[1]}`))
      .catch(() => reject(new Error(`Could not follow ${line[1]}`)))
  }),
  // /unfollow id
  '/unfollow': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve(Constants.HELP.unfollow)
    }

    return modules.follow(line[1], false)
      .then(() => resolve(`Unfollowed ${line[1]}`))
      .catch(() => reject(new Error(`Could not unfollow ${line[1]}`)))
  }),
  // /whoami returns my own id
  '/whoami': (line) => new Promise((resolve, reject) => {
    return modules.whoami()
      .then((id) => resolve(id))
      .catch(() => reject(new Error(Constants.COMMAND_TEXT.WHOAMI.FAILURE)))
  }),
  '/private': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return reject(new Error(Constants.COMMAND_TEXT.PRIVATE.NO_RECIPIENTS))
    }
    const recipients = line.slice(1).join(' ').split(',').map(x => x.trim())
    if (recipients.length > 6) {
      return reject(new Error(Constants.COMMAND_TEXT.PRIVATE.TOO_MANY_RECIPIENTS))
    }
    const ids = recipients.map(r => state.getAuthorId(r))
    if (!ids.every(id => ref.isFeedId(id))) {
      return reject(new Error(Constants.COMMAND_TEXT.PRIVATE.INVALID_FEED_IDS))
    }
    state.setPrivateRecipients(ids)
    resolve()
  }),
  // /whois returns the id of an already-identified individual
  '/whois': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve(Constants.HELP.whois)
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
        .catch((e) => reject(e))
    } else if (command[0] === '/') {
      return resolve({ command: false, print: Constants.COMMAND_TEXT.INVALID })
    }
    return resolve({})
  }),
  commands
}
