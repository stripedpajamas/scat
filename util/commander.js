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
        printer.system(constants.HELP.block)
        resolve({ command: true })
      }

      return core.commands.block(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /follow id
    case '/follow': {
      if (line.length < 2) {
        printer.system(constants.HELP.follow)
        return resolve({ command: true })
      }
      return core.commands.follow(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
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
        printer.system(helpSummary)
        return resolve({ command: true })
      }

      printer.system(constants.HELP[line[1]] || constants.HELP.NOT_FOUND)
      return resolve({ command: true })
    }
    // /identify id name
    case '/identify': {
      if (line.length < 3) {
        printer.system(constants.HELP.identify)
        return resolve({ command: true })
      }
      printer.system('Setting name...')
      return core.commands.identify(line[1], line[2])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /me status (action message in IRC land)
    case '/me': {
      const restOfLine = line.slice(1).join(' ')

      return core.commands.me(restOfLine)
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /name name
    case '/nick':
    case '/name': {
      if (line.length < 2) {
        printer.system(constants.HELP.name)
        return resolve({ command: true })
      }
      printer.system('Setting name...')
      return core.commands.nick(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /unreads to get current unreads
    case '/unreads': {
      return core.commands.unreads()
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /private @recp
    case '/private': {
      const recipients = line.slice(1).join(' ').split(',').map(x => x.trim())
      return core.commands.private(recipients)
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /pub invite-code
    case '/pub': {
      if (line.length < 2) {
        printer.system(constants.HELP.pub)
        return resolve({ command: true })
      }

      return core.commands.pub(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /quit leaves private mode if in it
    case '/q':
    case '/quit': {
      return core.commands.quit()
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /say something to say something without command-processing it
    case '/say': {
      const restOfLine = line.slice(1).join(' ')
      return core.commands.say(restOfLine)
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /unfollow id
    case '/unfollow': {
      if (line.length < 2) {
        printer.system(constants.HELP.unfollow)
        return resolve({ command: true })
      }

      return core.commands.unfollow(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /unblock id
    case '/unblock': {
      if (line.length < 2) {
        printer.system(constants.HELP.unblock)
        return resolve({ command: true })
      }

      return core.commands.unblock(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /whoami returns my own id
    case '/whoami': {
      return core.commands.whoami()
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }
    // /whois returns the id of an already-identified individual
    case '/whois': {
      if (line.length < 2) {
        printer.system(constants.HELP.whois)
        return resolve({ command: true })
      }
      return core.commands.whois(line[1])
        .then((result) => {
          printer.system(result.result)
          resolve({ command: true })
        })
        .catch(reject)
    }

    default: {
      if (command[0] === '/') {
        printer.system(constants.HELP.COMMAND_NOT_FOUND)
        return resolve({ command: true })
      }
      return resolve({})
    }
  }
})
