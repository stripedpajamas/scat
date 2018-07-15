const tc = require('turbocolor')
const Input = require('diffy/input')
const state = require('../state')
const commander = require('../commander')
const messenger = require('../messenger')
const tabComplete = require('../tabComplete')
const printer = require('./printer')
const client = require('../client')

let tabCompleter = null

const inputStyle = (start, cursor, end) =>
  `${start}${tc.white.bold('|')}${cursor || ''}${end}`

const input = Input({ style: inputStyle })

// populate input with last message sent by me when i hit up
input.on('up', () => {
  input.set(state.getLastInput())
})

// clear the input if i hit down or esc
input.on('down', () => input.set(''))
input.on('keypress', (_, key) => {
  // on any key press that isn't a tab, cancel tab completion
  if (key && key.name !== 'tab') {
    tabCompleter = null
  }
  if (key && key.name === 'escape') {
    input.set('')
  }
  if (key && key.name === 'pageup') {
    state.viewPageUp()
  }
  if (key && key.name === 'pagedown') {
    state.viewPageDown()
  }
})

// post a message or fire a command when i hit enter
input.on('enter', (line) => {
  state.setLastInput(line)
  // handle /slash commands
  commander(line)
    .then((response) => {
      if (response.print) {
        printer.system(response.print)
      } else if (!response.command) {
        // default to post a message
        messenger.sendMessage(line).catch(printer.error)
      }
    })
    .catch(printer.error)
})

// try to complete an id when i hit tab
input.on('tab', () => {
  if (!tabCompleter) {
    tabCompleter = tabComplete(input.rawLine())
  }
  input.set(tabCompleter())
})

// exit gracefully when i hit control-c
input.on('ctrl-c', () => {
  console.log('\n\nGoodbye\n')
  client.stop()
  process.exit(0)
})

// cycle through unread messages when i press control-u
input.on('ctrl-u', () => {
  const unread = state.getLastNotification()
  // if there are no unreads
  if (!unread.length) {
    state.setPublicMode()
    return
  }

  // if there are unreads, we want to go to private mode with those recipients
  state.setPrivateRecipients(unread)
})

input.on('ctrl-t', () => {
  if (state.isPrivateMode()) {
    state.setPublicMode()
    return
  }

  if (state.getLastPrivateRecipient().length) {
    state.setPrivateRecipients(state.getLastPrivateRecipient())
  }
})

module.exports = input
