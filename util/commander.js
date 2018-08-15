const constants = require('./constants')
const core = require('ssb-chat-core')
const printer = require('./ui/printer')

module.exports = (input) => new Promise((resolve, reject) => {
  const line = input.split(' ')
  const command = line[0]

  switch (command) {
    case '/state': {
      return core.commands.state(line[1])
        .then(({ result }) => console.log(result))
        .catch(reject)
    }
    // block id
    case '/block': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.block })
      }

      return core.commands.block(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /follow id
    case '/follow': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.follow })
      }
      return core.commands.follow(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /help show usage information
    case '/help': {
      // if no argument passed in, send help summary
      if (line.length < 2) {
        const helpSummary = [
          constants.HELP.AVAILABLE_COMMANDS,
          constants.COMMANDS.join(', '),
          constants.HELP.MORE_INFO
        ].join(' ')
        return resolve({ command: true, result: helpSummary })
      }

      return resolve({ command: true, result: constants.HELP[line[1]] || constants.HELP.NOT_FOUND })
    }
    // /identify id name
    case '/identify': {
      if (line.length < 3) {
        return resolve({ command: true, result: constants.HELP.identify })
      }

      return core.commands.identify(line[1], line[2])
        .then(resolve)
        .catch(reject)
    }
    // /me status (action message in IRC land)
    case '/me': {
      const restOfLine = line.slice(1).join(' ')
      
      return core.commands.me(restOfLine)
        .then(resolve)
        .catch(printer.error)
    }
    // /name name
    case '/nick':
    case '/name': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.name })
      }

      return core.commands.nick(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /unreads to get current unreads
    case '/unreads': {
      return core.commands.unreads()
        .then(resolve)
        .catch(reject)
    }
    // /private @recp
    case '/private': {
      const recipients = line.slice(1).join(' ').split(',').map(x => x.trim())
      return core.commands.private(recipients)
        .then(resolve)
        .catch(reject)
    }
    // /pub invite-code
    case '/pub': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.pub })
      }

      return core.commands.pub(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /quit leaves private mode if in it
    case '/q':
    case '/quit': {
      core.commands.quit()
        .then(resolve)
        .catch(reject)
    }
    // /say something to say something without command-processing it
    case '/say': {
      const restOfLine = line.slice(1).join(' ')
      return core.commands.say(restOfLine)
        .then(resolve)
        .catch(reject)
    }
    // /unfollow id
    case '/unfollow': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.unfollow })
      }

      return core.commands.unfollow(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /unblock id
    case '/unblock': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.unblock })
      }

      return core.commands.unblock(line[1])
        .then(resolve)
        .catch(reject)
    }
    // /whoami returns my own id
    case '/whoami': {
      return core.commands.whoami()
        .then(resolve)
        .catch(reject)
    }
    // /whois returns the id of an already-identified individual
    case '/whois': {
      if (line.length < 2) {
        return resolve({ command: true, result: constants.HELP.whois })
      }
      return core.commands.whois(line[1])
        .then(resolve)
        .catch(reject)
    }

    default: {
      if (command[0] === '/') {
        return resolve({ command: false, result: constants.HELP.COMMAND_NOT_FOUND })
      }
      return resolve({})
    }
  }
})
