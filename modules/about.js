const ref = require('ssb-ref')
const state = require('../util/state')
const constants = require('../util/constants')

module.exports = (name, who) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    const me = state.getMe()
    let target = who || me

    // if this is a name and not an id, look up the id in our author map
    if (!ref.isFeedId(target)) {
      target = state.getAuthor(target)
    }

    if (sbot && target && name) {
      sbot.publish({ type: constants.ABOUT, about: target, name }, (err) => {
        if (err) return reject(err)
        resolve()
      })
    }
  })
}
