const client = require('../util/client')

module.exports = (enc) => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    if (sbot && enc) {
      sbot.private.unbox(enc, (err, content) => {
        if (err) return reject(err)
        resolve(content)
      })
    }
  })
}
