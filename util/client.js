const path = require('path')
const scuttleshell = require('scuttle-shell')
const config = require('ssb-config')
const ssbKeys = require('ssb-keys')
const client = require('ssb-client')

config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

let retriesRemaining = 5
let started = false

const tryConnect = (cb) => {
  retriesRemaining--
  // Check if sbot/scutlle-shell is already running
  client(config.keys, config, (err, sbot) => {
    // err implies no server currently running
    if (err) {
      // start scuttle shell if haven't already tried starting it
      if (!started) {
        scuttleshell.start()
        started = true
      }
    }
    cb(null, sbot)
  })
}

module.exports = {
  start: (cb) => {
    console.log('Connecting to scuttlebot...')
    let interval
    tryConnect((_, sbot) => {
      if (!sbot) {
        interval = setInterval(() => {
          if (retriesRemaining > 0) {
            tryConnect((_, sbot) => {
              if (sbot) {
                cb(null, sbot)
                clearInterval(interval)
              }
            })
          } else {
            cb(new Error('Could not connect to sbot'))
            clearInterval(interval)
          }
        }, 1000)
      } else {
        cb(null, sbot)
      }
    })
  },
  stop: () => {
    if (started) {
      scuttleshell.stop()
    }
  }
}
