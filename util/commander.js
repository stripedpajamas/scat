const ref = require('ssb-ref')
const Constants = require('./constants')
const state = require('./state')
const modules = require('../modules')
const messenger = require('./messenger')
const ui = require('./ui')

module.exports = (input) => new Promise((resolve, reject) => {
  const line = input.split(' ')
  const command = line[0]

  switch (command) {
    // /clear to clear notifications
    case '/clear': {
      state.resetNotifications()
      return resolve({ command: true, print: 'Notifications reset' })
    }
    // /follow id
    case '/follow': {
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.follow })
      }

      return modules.follow(line[1], true)
        .then(() => resolve({ command: true, print: `Followed ${line[1]}` }))
        .catch(() => reject(new Error(`Could not follow ${line[1]}`)))
    }
    // /help show usage information
    case '/help': {
      // if no argument passed in, send help summary
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.SUMMARY })
      }

      return resolve({ command: true, print: Constants.HELP[line[1]] || Constants.HELP.NOT_FOUND })
    }
    // /identify id name
    case '/identify': {
      if (line.length < 3) {
        return resolve({ command: true, print: Constants.HELP.identify })
      }

      return modules.about(line[2], line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.NAME.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
    }
    // /me status (action message in IRC land)
    case '/me': {
      const restOfLine = line.slice(1).join(' ')
      // send message
      messenger.sendAction(restOfLine).catch(ui.printErrMsg)
      return resolve({ command: true })
    }
    // /name name
    case '/nick':
    case '/name': {
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.name })
      }

      return modules.about(line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.NAME.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
    }
    // /notifications to get current unreads
    case '/notifications': {
      const notifications = state.getNotifications().map(state.getAuthor).join('; ')
      const notificationText = `Unread messages from: ${notifications}`
      return resolve({ command: true, print: notifications ? notificationText : 'No unread messages' })
    }
    // /private @recp
    case '/private': {
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
      return resolve({ command: true })
    }
    // /pub invite-code
    case '/pub': {
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.pub })
      }

      // attempt to join with the supplied invite code
      return modules.invite(line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.PUB.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.PUB.FAILURE)))
    }
    // /quit leaves private mode if in it
    case '/q':
    case '/quit': {
      if (!state.isPrivateMode()) {
        return resolve({ command: true, print: Constants.COMMAND_TEXT.QUIT.FROM_PUBLIC })
      }
      state.setPublicMode()
      return resolve({ command: true })
    }
    // /say something to say something without command-processing it
    case '/say': {
      const restOfLine = line.slice(1).join(' ')
      // send message
      messenger.sendMessage(restOfLine).catch(ui.printErrMsg)
      return resolve({ command: true })
    }
    // /unfollow id
    case '/unfollow': {
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.unfollow })
      }

      return modules.follow(line[1], false)
        .then(() => resolve({ command: true, print: `Unfollowed ${line[1]}` }))
        .catch(() => reject(new Error(`Could not unfollow ${line[1]}`)))
    }
    // /whoami returns my own id
    case '/whoami': {
      return modules.whoami()
        .then((id) => resolve({ command: true, print: id }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.WHOAMI.FAILURE)))
    }
    // /whois returns the id of an already-identified individual
    case '/whois': {
      if (line.length < 2) {
        return resolve({ command: true, print: Constants.HELP.whois })
      }
      return resolve({ command: true, print: state.getAuthorId(line[1]) })
    }

    default: {
      if (command[0] === '/') {
        return resolve({ command: false, print: Constants.COMMAND_TEXT.INVALID })
      }
      return resolve({})
    }
  }
})
