const state = require('../util/state')
const constants = require('../util/constants')

module.exports = ({ text, action }) => {
  return new Promise((resolve, reject) => {
    const sbot = state.getClient()
    if (sbot && text) {
      sbot.publish({ type: constants.MESSAGE_TYPE, text, action }, (err, msg) => {
        if (err) return reject(err)
        resolve(msg)
      })
    }
  })
}
