#!/usr/bin/env node
const pull = require('pull-stream')
const constants = require('./util/constants')
const client = require('./util/client')
const ui = require('./util/ui')
const state = require('./util/state')
const processor = require('./util/processor')
const updateNotifier = require('update-notifier')
const pkg = require('./package.json')

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 12 // 12 hours
}).notify({
  defer: true,
  isGlobal: true
})

process.on('uncaughtException', (e) => {
  console.log('\n\nUncaught exception, exiting :(')
  client.stop()
  process.exit(1)
})

const since = Date.now() - constants.TIME_WINDOW // 1 week of data

client.start((err, sbot) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // set our sbot instance and our self
  state.setClient(sbot)
  state.setMe(sbot.id)

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
  ui()
})
