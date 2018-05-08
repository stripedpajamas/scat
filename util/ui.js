const Diffy = require('diffy')
const trim = require('diffy/trim')
const Input = require('diffy/input')
const c = require('clorox')
const format = require('date-fns/format')
const client = require('./client')
const modules = require('../modules')
const commander = require('./commander')
const color = require('./color')
const sort = require('./sort')
const messenger = require('./messenger')
const tabComplete = require('./tabComplete')

const fmt = 'MMM DD HH:mm A'
const messages = []
let privateMessages = []
let tabCompleter = null

const diffy = Diffy({ fullscreen: false })
const input = Input({ showCursor: true })

// populate input with last message sent by me when i hit up
input.on('up', () => {
  const myMsgs = messages.filter(m => m.rawAuthor === client.getMe())
  if (myMsgs[myMsgs.length - 1]) {
    input.set(myMsgs[myMsgs.length - 1].rawText)
  }
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
})

// rerender while i type
input.on('update', () => diffy.render())

// post a message or fire a command when i hit enter
input.on('enter', (line) => {
  // handle /slash commands
  commander.cmd(line)
    .then((response) => {
      if (response.print) {
        printSysMsg(response.print)
      } else if (!response.command) {
        // default to post a message
        messenger.sendMessage(line).catch(printErrMsg)
      }
    })
    .catch((error) => {
      printErrMsg(error.message)
    })
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
  const sbot = client.getClient()
  if (sbot && sbot.control && typeof sbot.control.stop === 'function') {
    sbot.control.stop()
  }
  process.exit(0)
})

const visibleMessages = () => (
  client.isPrivateMode() ? client.getPrivateMessages() : client.getPublicMessages()
)

const prompter = () => (
  diffy.render(() => trim(`
    ${visibleMessages().map(m => `${m.time}  ${m.text()}`).join('\n')}
    > ${input.line()}
  `))
)

const setup = () => {
  prompter()
  setInterval(() => diffy.render(), 1000)
}

const printMsg = (msg) => {
  const message = {
    author: () => client.getAuthor(msg.author),
    rawAuthor: msg.author,
    text: () =>
      `${`${c.bold[color(msg.author)](client.getAuthor(msg.author))} : ${msg.private ? `${c.bgGreen(msg.content.text)}` : msg.content.text}`}`,
    rawText: msg.content.text,
    time: `${`${c.gray.dim(format(msg.timestamp, fmt))}`}`,
    rawTime: msg.timestamp
  }
  if (client.isPrivateMode() && msg.private) client.pushPrivateMessage(message)
  else client.pushPublicMessage(message)
}

const printSelfMsg = (msg) => {
  const message = {
    author: () => client.getAuthor(msg.author),
    rawAuthor: msg.author,
    text: () => `${`${c.bold.green(client.getAuthor(msg.author))} : ${msg.private ? `${c.bgGreen(msg.content.text)}` : msg.content.text}`}`,
    rawText: msg.content.text,
    time: `${`${c.gray.dim(format(msg.timestamp, fmt))}`}`,
    rawTime: msg.timestamp
  }
  if (client.isPrivateMode()) client.pushPrivateMessage(message)
  else client.pushPublicMessage(message)
}

const printSysMsg = (msg) => {
  client.pushMessage({
    text: () => `${`${c.bold.yellow(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

const printErrMsg = (msg) => {
  client.pushMessage({
    text: () => `${`${c.bold.bgRed.white(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

module.exports = {
  setup,
  prompter,
  printMsg,
  printSelfMsg,
  printSysMsg
}
