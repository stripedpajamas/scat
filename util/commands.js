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

    // attempt to join with the supplied invite code
    return modules.about(split[1])
      .then(() => resolve('Name set successfully'))
      .catch(() => reject(new Error('Could not set name')))
  }

  return resolve()
})
