const client = require('./client')
const modules = require('../modules')

module.exports = (line) => new Promise((resolve, reject) => {
  // /pub invite-code
  if (line.indexOf('/pub') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve({ command: true, print: 'To join a pub: /pub invite-code' })
    }

    // attempt to join with the supplied invite code
    return modules.invite(split[1])
      .then(() => resolve({ command: true, print: 'Pub joined successfully' }))
      .catch(() => reject(new Error('Could not join pub')))
  }

  // /name name
  if (line.indexOf('/name') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve({ command: true, print: 'To set your name: /name john' })
    }

    return modules.about(split[1])
      .then(() => resolve({ command: true, print: 'Name set successfully' }))
      .catch(() => reject(new Error('Could not set name')))
  }

  // /identify id name
  if (line.indexOf('/identify') === 0) {
    const split = line.split(' ')
    if (split.length < 3) {
      return resolve({ command: true, print: 'To personally identify someone else: /identify @id name' })
    }

    return modules.about(split[2], split[1])
      .then(() => resolve({ command: true, print: 'Name set successfully' }))
      .catch(() => reject(new Error('Could not set name')))
  }

  // /follow id
  if (line.indexOf('/follow') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve({ command: true, print: 'To follow someone: /follow @id' })
    }

    return modules.follow(split[1], true)
      .then(() => resolve({ command: true, print: `Followed ${split[1]}` }))
      .catch(() => reject(new Error(`Could not follow ${split[1]}`)))
  }

  // /unfollow id
  if (line.indexOf('/unfollow') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve({ command: true, print: 'To unfollow someone: /unfollow @id' })
    }

    return modules.follow(split[1], false)
      .then(() => resolve({ command: true, print: `Unfollowed ${split[1]}` }))
      .catch(() => reject(new Error(`Could not unfollow ${split[1]}`)))
  }

  // /whoami returns my own id
  if (line.indexOf('/whoami') === 0) {
    return modules.whoami()
      .then((id) => resolve({ command: true, print: id }))
      .catch(() => reject(new Error('Could not figure out who you are')))
  }

  // /whois returns the id of an already-identified individual
  if (line.indexOf('/whois') === 0) {
    const split = line.split(' ')
    if (split.length < 2) {
      return resolve({ command: true, print: 'To get someone\'s id: /whois name' })
    }
    return resolve({ command: true, print: client.getAuthorId(split[1]) })
  }

  // /private @id,@id msg
  if (line.indexOf('/private') === 0) {
    const split = line.split(' ')
    if (split.length < 3) {
      return resolve({ command: true, print: 'To send a private message: /private @id1,...,@id7 msg' })
    }
    const recipients = split[1].split(',')
    if (recipients.length > 6) {
      return resolve({ command: true, print: 'You can only send a private message to up to 7 recipients' })
    }
    const msg = split.slice(2).join(' ')
    return modules.private(msg, recipients)
      .then(() => resolve({ command: true }))
      .catch((e) => console.log(e) && reject(new Error('Could not send private message')))
  }

  return resolve({})
})
