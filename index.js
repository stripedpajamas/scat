#!/usr/bin/env node
const pull = require('pull-stream')
const party = require('ssb-party')
const constants = require('./util/constants')
const ui = require('./util/ui')
const client = require('./util/client')
const processor = require('./util/processor')

process.on('uncaughtException', () => {
  console.log('Uncaught exception, exiting :(')
  const sbot = client.getClient()
  sbot && sbot.control && typeof sbot.control.stop === 'function' && sbot.control.stop()
  process.exit(1)
})

const opts = { party: { out: false, err: false }, timers: { keepalive: 10 } }
const hr = 60 * 60 * 1000
const since = Date.now() - (7 * 24 * hr) // 1 week of data

party(opts, (err, sbot) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // set our sbot instance and our self
  client.setClient(sbot)
  client.setMe(sbot.id)

  // start streaming abouts
  pull(
    // don't limit the about messages to a week because we want identifiers
    sbot.messagesByType({ type: constants.ABOUT, live: true }),
    pull.drain(processor)
  )

  // start streaming messages
  pull(
    sbot.messagesByType({ type: constants.MESSAGE_TYPE, live: true, gt: since }),
    pull.drain(processor)
  )

  // kick off the UI
  ui.setup()
})
