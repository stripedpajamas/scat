const pull = require('pull-stream')
const party = require('ssb-party')
const constants = require('./util/constants')
const ui = require('./util/ui')
const client = require('./util/client')
const processor = require('./util/processor')
const whoami = require('./modules/whoami')

const opts = { party: { out: false }, timers: { keepalive: 10000 } }

party(opts, (err, sbot) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  client.setClient(sbot)
  // set our self
  whoami()
    .then((me) => {
      client.setMe(me)

      // start streaming abouts
      pull(
        sbot.messagesByType({ type: constants.ABOUT, live: true }),
        pull.drain(processor)
      )

      // start streaming messages
      pull(
        sbot.messagesByType({ type: constants.MESSAGE_TYPE, live: true }),
        pull.drain(processor)
      )

      // kick off the UI
      ui.setup()
    })
    .catch((e) => {
      console.log('Something went horribly wrong')
      process.exit(1)
    })
})
