const os = require('os')
const path = require('path')
const storage = require('node-persist')
const constants = require('./constants')

// initialize storage in ~/.scat/notifications
const dir = path.join(os.homedir(), constants.PROGRAM_DIR, 'notifications')

storage.init({
  dir,
  expiredInterval: 60000, // prune expired messages every 10 mins
  forgiveParseErrors: true
})

module.exports = storage
