const client = require('./client')
const modules = require('../modules')

module.exports = (line) => new Promise((resolve, reject) => {
  // /pub invite-code
  if (line.indexOf('/pub') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve('To join a pub: /pub invite-code')
    }

    // attempt to join with the supplied invite code
    return modules.invite(split[1])
      .then(() => resolve('Pub joined successfully'))
      .catch(() => reject(new Error('Could not join pub')))
  }

  // /name name
  if (line.indexOf('/name') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve('To set your name: /name john')
    }

    return modules.about(split[1])
      .then(() => resolve('Name set successfully'))
      .catch(() => reject(new Error('Could not set name')))
  }

  // /identify id name
  if (line.indexOf('/identify') === 0) {
    const split = line.split(' ')
    if (split.length < 3) {
      return resolve('To personally identify someone else: /identify @id name')
    }

    return modules.about(split[2], split[1])
      .then(() => resolve('Name set successfully'))
      .catch(() => reject(new Error('Could not set name')))
  }

  // /follow id
  if (line.indexOf('/follow') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve('To follow someone: /follow @id')
    }

    return modules.follow(split[1], true)
      .then(() => resolve(`Followed ${split[1]}`))
      .catch(() => reject(new Error(`Could not follow ${split[1]}`)))
  }

  // /unfollow id
  if (line.indexOf('/unfollow') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve('To unfollow someone: /unfollow @id')
    }

    return modules.follow(split[1], false)
      .then(() => resolve(`Unfollowed ${split[1]}`))
      .catch(() => reject(new Error(`Could not unfollow ${split[1]}`)))
  }

  if (line.indexOf('/whoami') === 0) {
    return modules.whoami()
      .then((id) => resolve(id))
      .catch(() => reject(new Error('Could not figure out who you are')))
  }

  if (line.indexOf('/whois') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve('To get someone\'s id: /whois name')
    }
    return resolve(client.getAuthorId(split[1]))
  }

  return resolve()
})
