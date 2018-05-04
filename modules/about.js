const client = require('../util/client')
const constants = require('../util/constants')

module.exports = (name, who) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    const me = client.getMe()
    let target = who || me

    // if this is a name and not an id, look up the id in our author map
    if (target.indexOf('@') !== 0) {
      target = client.getAuthor(target)
    }

    if (sbot && target && name) {
      sbot.publish({ type: constants.ABOUT, about: target, name }, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
