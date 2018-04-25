const client = require('../util/client')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const sbot = client.getClient()
    if (sbot) {
      sbot.whoami((err, id) => {
        if (err) return reject(err)
        resolve(id.id)
      })
    }
  })
}
