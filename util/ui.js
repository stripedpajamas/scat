const Diffy = require('diffy')
const trim = require('diffy/trim')
const Input = require('diffy/input')
const c = require('clorox')
const client = require('./client')
const modules = require('../modules')
const commands = require('./commands')
const color = require('./color')

const messages = []

// const style = (start, cursor, end) => `> ${start}${cursor || ' '}${end}`

const diffy = Diffy({ fullscreen: true })
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
  if (key && key.name === 'escape') {
    input.set('')
  }
})

// rerender while i type
input.on('update', () => diffy.render())

// post a message or fire a command when i hit enter
input.on('enter', (line) => {
  // handle /slash commands
  commands(line)
    .then((response) => {
      if (response) {
        printSysMsg(response)
      } else {
        // default to post a message
        modules.post(line).catch(() => printErrMsg('Failed to post message'))
      }
    })
    .catch((error) => {
      printErrMsg(error.message)
    })
})

// exit gracefully when i hit control-c
input.on('ctrl-c', () => {
  console.log('Goodbye\n\n')
  process.exit(0)
})

const prompter = () => (
  diffy.render(() => trim(`
    ${messages.map(m => m.text).join('\n')}
    > ${input.line()}
  `))
)

const setup = () => {
  prompter()
  setInterval(() => diffy.render(), 1000)
}

const printMsg = (msg) => {
  messages.push({
    author: client.getAuthor(msg.author),
    rawAuthor: msg.author,
    text: `${`${c.bold[color(msg.author)](client.getAuthor(msg.author))} : ${msg.content.text}`}`,
    rawText: msg.content.text
  })
}

const printSelfMsg = (msg) => {
  messages.push({
    author: client.getAuthor(msg.author),
    rawAuthor: msg.author,
    text: `${`${c.bold.green(client.getAuthor(msg.author))} : ${msg.content.text}`}`,
    rawText: msg.content.text
  })
}

const printSysMsg = (msg) => {
  messages.push({
    text: `${`${c.bold.yellow(msg)}`}`,
    rawText: msg
  })
}

const printErrMsg = (msg) => {
  messages.push({
    text: `${`${c.bold.bgRed.white(msg)}`}`,
    rawText: msg
  })
}

module.exports = {
  setup,
  prompter,
  printMsg,
  printSelfMsg,
  printSysMsg
}
