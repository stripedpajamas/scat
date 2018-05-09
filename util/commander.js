const client = require('./client')
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
    client.setPublicMode()
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
  // /whois returns the id of an already-identified individual
  '/whois': (line) => new Promise((resolve, reject) => {
    if (line.length < 2) {
      return resolve('To get someone\'s id: /whois name')
    }
    return resolve(client.getAuthorId(line[1]))
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
    }
    return resolve({})
  }),
  commands
}
