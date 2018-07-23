#!/usr/bin/env node
const updateNotifier = require('update-notifier')
const clp = require('clp')
const core = require('ssb-chat-core')
const state = require('./util/state')
const ui = require('./util/ui')
const pkg = require('./package.json')

const args = clp()
// put args into state
state.setArgs(args)

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 12 // 12 hours
}).notify({
  defer: true,
  isGlobal: true
})

process.on('uncaughtException', (e) => {
  if (args.debug) {
    console.log(e)
  } else {
    console.log('\n\nUncaught exception, exiting :(')
  }
  core.stop()
  process.exit(1)
})

// set up listener for mode changes so we can clear system/error msgs
core.events.mode.onChange((mode) => {
  state.resetSystemMessage()
})

core.start({
  debug: !!args.debug,
  timeWindow: (args.days || 0) * 24 * 60 * 60 * 1000
}, (err) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  ui({ debug: !!args.debug })
})
