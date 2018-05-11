const Diffy = require('diffy')
const trim = require('diffy/trim')
const Input = require('diffy/input')
const c = require('clorox')
const format = require('date-fns/format')
const client = require('./client')
const commander = require('./commander')
const color = require('./color')
const messenger = require('./messenger')
const tabComplete = require('./tabComplete')

const fmt = 'MMM DD HH:mm A'
let tabCompleter = null

const diffy = Diffy({ fullscreen: false })
const input = Input({ showCursor: true })

// populate input with last message sent by me when i hit up
input.on('up', () => {
  const myMsgs = client.getMessages().filter(m => m.rawAuthor === client.getMe())
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
    .catch(printErrMsg)
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

// header describing mode and potentially private recipients
const header = () => {
  const mode = client.getMode()
  const isPrivate = client.isPrivateMode()
  const recipients = client.getPrivateRecipientNames()
  return `:: ${mode} MODE ${isPrivate ? `(${recipients.join(', ')}) ` : ''}::`
}

const prompter = () => (
  diffy.render(() => {
    const messages = client.getMessages()
    // i only want messages to take up about 75% of the screen
    const slim = messages.slice(Math.floor(messages.length - (diffy.height * 0.75)))
    return trim(`
      ${header()}
      ${slim.map(m => `${m.time}  ${m.text()}`).join('\n')}
      > ${input.line()}
    `)
  })
)

const printMsg = (msg) => {
  const fromMe = msg.author === client.getMe()
  const authorText = () => c.bold[fromMe ? 'green' : color(msg.author)](client.getAuthor(msg.author))
  const messageText = () => msg.private ? `${c.bgGreen(msg.content.text)}` : msg.content.text
  const timeText = `${c.gray.dim(format(msg.timestamp, fmt))}`
  client.pushMessage({
    author: () => client.getAuthor(msg.author),
    rawAuthor: msg.author,
    private: msg.private,
    recipients: msg.content.recipients,
    text: () => `${`${authorText()} : ${messageText()}`}`,
    rawText: msg.content.text,
    time: `${timeText}`,
    rawTime: msg.timestamp
  })
}

const printSysMsg = (msg) => {
  client.pushMessage({
    text: () => `${`${c.bold.yellow(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

const printErrMsg = (error) => {
  const msg = error.message
  client.pushMessage({
    text: () => `${`${c.bold.bgRed.white(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

const setup = () => {
  prompter()
  setInterval(() => diffy.render(), 100)
}

module.exports = {
  setup,
  printMsg
}
