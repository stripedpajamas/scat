const Diffy = require('diffy')
const trim = require('diffy/trim')
const Input = require('diffy/input')
const c = require('clorox')
const format = require('date-fns/format')
const state = require('./state')
const commander = require('./commander')
const color = require('./color')
const messenger = require('./messenger')
const tabComplete = require('./tabComplete')
const render = require('./renderer')

const fmt = 'MMM DD HH:mm'
let tabCompleter = null

const inputStyle = (start, cursor, end) =>
  `${start}${c.white.bold('|')}${cursor || ''}${end}`

const diffy = Diffy({ fullscreen: true })
const input = Input({ style: inputStyle })

// populate input with last message sent by me when i hit up
input.on('up', () => {
  const myMsgs = state.getMessages().filter(m => m.rawAuthor === state.getMe())
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
  if (key && key.name === 'pageup') {
    state.viewPageUp()
  }
  if (key && key.name === 'pagedown') {
    state.viewPageDown()
  }
})

// rerender while i type
input.on('update', () => diffy.render())

// post a message or fire a command when i hit enter
input.on('enter', (line) => {
  // handle /slash commands
  commander(line)
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
  const sbot = state.getClient()
  if (sbot && sbot.control && typeof sbot.control.stop === 'function') {
    sbot.control.stop()
  }
  process.exit(0)
})

// update state with dimensions on resize
diffy.on('resize', () => {
  state.setViewport(diffy.width, diffy.height)
})

// header describing mode and potentially private recipients
const header = () => {
  const mode = state.getMode()
  const isPrivate = state.isPrivateMode()
  const scrolling = state.getScrolling()
  const isScrolling = scrolling.isScrolling
  const atTop = scrolling.atTop
  const recipients = state.getPrivateRecipientsNotMe()
  const leftHeaderText = `:: ${mode} MODE ${isPrivate ? `(${recipients.join(', ')}) ` : ''}:: ${isScrolling ? `(MESSAGE HISTORY${atTop ? ' - TOP' : ''})` : ''}`
  const notification = state.getLastNotification() || []
  const notificationRecipients = notification ? notification.map(state.getAuthor).join(', ') : ''
  const rightHeaderText = notificationRecipients && `Private msg from: ${notificationRecipients}`
  const leftHeader = isPrivate ? `${c.bgBlack.white(leftHeaderText)}` : `${c.bgWhite.black(leftHeaderText)}`
  const rightHeader = `${c.bgYellow.black(rightHeaderText)}`
  const spacerWidth = diffy.width - leftHeaderText.length - rightHeaderText.length
  const spacer = ' '.repeat(spacerWidth > 0 ? spacerWidth : 1)
  return `${leftHeader}${spacer}${rightHeader}`
}

const prompter = () => (
  diffy.render(() => {
    const messages = state.getViewableMessages()
    const systemMessage = state.getSystemMessage()
    return trim(`
      ${header()}
      ${messages.join('\n')}
      ${systemMessage ? `${systemMessage.time}  ${systemMessage.text()}` : ''}
      > ${input.line()}
    `)
  })
)

const printMsg = (m) => {
  const msg = m.value
  const fromMe = msg.author === state.getMe()
  const authorText = () => c.bold[fromMe ? 'green' : color(msg.author)](state.getAuthor(msg.author))
  const timeText = `${c.gray.dim(format(msg.timestamp, fmt))}`
  const renderedMsg = render(msg.content.text)

  state.pushMessage({
    key: m.key,
    author: () => state.getAuthor(msg.author),
    rawAuthor: msg.author,
    private: msg.wasPrivate,
    recipients: msg.content.recps || msg.content.recipients, // backwards compatibility
    text: () => `${`${authorText()} : ${renderedMsg}`}`,
    rawText: msg.content.text,
    lineLength: () => Math.ceil(
      (fmt.length + 1 + state.getAuthor(msg.author).length + 3 + (msg.content.text.length || 0)) / diffy.width
    ),
    time: `${timeText}`,
    rawTime: msg.timestamp
  })
}

// action messages are like `/me is washing the dishes`
// it would look silly for that be like May 25 12:05 @squicc : @squicc is washing the dishes
// so we want to spruce it up a little bit
const printActionMsg = (m) => {
  const msg = m.value
  const fromMe = msg.author === state.getMe()
  const authorText = () => c.bold[fromMe ? 'green' : color(msg.author)](state.getAuthor(msg.author))
  const timeText = `${c.gray.dim(format(msg.timestamp, fmt))}`
  const renderedMsg = c.bold[fromMe ? 'green' : color(msg.author)](render(msg.content.text))

  state.pushMessage({
    key: m.key,
    author: () => state.getAuthor(msg.author),
    rawAuthor: msg.author,
    private: msg.wasPrivate,
    recipients: msg.content.recps || msg.content.recipients, // backwards compatibility
    text: () => `${`${authorText()} ${renderedMsg}`}`,
    rawText: msg.content.text,
    lineLength: () => Math.ceil(
      (fmt.length + 1 + state.getAuthor(msg.author).length + 2 + (msg.content.text.length || 0)) / diffy.width
    ),
    time: `${timeText}`,
    rawTime: msg.timestamp
  })
}

const printSysMsg = (msg) => {
  state.pushSystemMessage({
    text: () => `${`${c.bold.yellow(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

const printErrMsg = (error) => {
  const msg = error.message
  state.pushSystemMessage({
    text: () => `${`${c.bold.bgRed.white(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), fmt))}`}`,
    rawTime: Date.now()
  })
}

const setup = () => {
  state.setViewport(diffy.width, diffy.height)
  prompter()
  setInterval(() => diffy.render(), 100)
}

module.exports = {
  setup,
  printMsg,
  printSysMsg,
  printErrMsg,
  printActionMsg
}
