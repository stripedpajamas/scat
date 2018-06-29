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
      resolve({ command: true, print: 'Notifications reset' })
      break
    }
    // /follow id
    case '/follow': {
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.follow })
        break
      }

      modules.follow(line[1], true)
        .then(() => resolve({ command: true, print: `Followed ${line[1]}` }))
        .catch(() => reject(new Error(`Could not follow ${line[1]}`)))
      break
    }
    // /help show usage information
    case '/help': {
      // if no argument passed in, send help summary
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.SUMMARY })
        break
      }

      resolve({ command: true, print: Constants.HELP[line[1]] || Constants.HELP.NOT_FOUND })
      break
    }
    // /identify id name
    case '/identify': {
      if (line.length < 3) {
        resolve({ command: true, print: Constants.HELP.identify })
        break
      }

      modules.about(line[2], line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.NAME.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
      break
    }
    // /name name
    case '/nick':
    case '/name': {
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.name })
        break
      }

      modules.about(line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.NAME.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.NAME.FAILURE)))
      break
    }
    // /notifications to get current unreads
    case '/notifications': {
      const notifications = state.getNotifications().map(state.getAuthor).join('; ')
      const notificationText = `Unread messages from: ${notifications}`
      resolve({ command: true, print: notifications ? notificationText : 'No unread messages' })
      break
    }
    // /private @recp
    case '/private': {
      if (line.length < 2) {
        reject(new Error(Constants.COMMAND_TEXT.PRIVATE.NO_RECIPIENTS))
        break
      }
      const recipients = line.slice(1).join(' ').split(',').map(x => x.trim())
      if (recipients.length > 6) {
        reject(new Error(Constants.COMMAND_TEXT.PRIVATE.TOO_MANY_RECIPIENTS))
        break
      }
      const ids = recipients.map(r => state.getAuthorId(r))
      if (!ids.every(id => ref.isFeedId(id))) {
        reject(new Error(Constants.COMMAND_TEXT.PRIVATE.INVALID_FEED_IDS))
        break
      }
      state.setPrivateRecipients(ids)
      resolve({ command: true })
      break
    }
    // /pub invite-code
    case '/pub': {
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.pub })
        break
      }

      // attempt to join with the supplied invite code
      modules.invite(line[1])
        .then(() => resolve({ command: true, print: Constants.COMMAND_TEXT.PUB.SUCCESS }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.PUB.FAILURE)))
      break
    }
    // /quit leaves private mode if in it
    case '/q':
    case '/quit': {
      if (!state.isPrivateMode()) {
        resolve({ command: true, print: Constants.COMMAND_TEXT.QUIT.FROM_PUBLIC })
        break
      }
      state.setPublicMode()
      resolve({ command: true })
      break
    }
    // /say something to say something without command-processing it
    case '/say': {
      const restOfLine = line.slice(1).join(' ')
      // send message
      messenger.sendMessage(restOfLine).catch(ui.printErrMsg)
      resolve({ command: true })
      break
    }
    // /unfollow id
    case '/unfollow': {
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.unfollow })
      }

      modules.follow(line[1], false)
        .then(() => resolve({ command: true, print: `Unfollowed ${line[1]}` }))
        .catch(() => reject(new Error(`Could not unfollow ${line[1]}`)))
      break
    }
    // /whoami returns my own id
    case '/whoami': {
      modules.whoami()
        .then((id) => resolve({ command: true, print: id }))
        .catch(() => reject(new Error(Constants.COMMAND_TEXT.WHOAMI.FAILURE)))
      break
    }
    // /whois returns the id of an already-identified individual
    case '/whois': {
      if (line.length < 2) {
        resolve({ command: true, print: Constants.HELP.whois })
        break
      }
      resolve({ command: true, print: state.getAuthorId(line[1]) })
      break
    }

    default: {
      if (command[0] === '/') {
        resolve({ command: false, print: Constants.COMMAND_TEXT.INVALID })
        break
      }
      break
    }
  }
})
