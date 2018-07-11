const c = require('clorox')
const format = require('date-fns/format')
const render = require('./renderer')
const state = require('../state')
const color = require('../color')
const constants = require('../constants')

const highlightMentions = (text) => {
  // color me if i was mentioned
  let highlighted = text
  if (typeof highlighted === 'string') {
    state.getMeNames().forEach((me) => {
      highlighted = highlighted.split(' ').map((word) => {
        if (word === me) {
          return `${c.bgMagenta.black(word)}`
        }
        return word
      }).join(' ')
    })
  }
  return highlighted
}

const message = (m) => {
  const msg = m.value
  const fromMe = msg.author === state.getMe()
  const authorText = () => c.bold[fromMe ? 'green' : color(msg.author)](state.getAuthor(msg.author))
  const timeText = `${c.gray.dim(format(msg.timestamp, constants.TIME_FORMAT))}`
  const renderedMsg = render(msg.content.text)

  const currentWidth = state.getWidth()

  return state.pushMessage({
    key: m.key,
    author: () => state.getAuthor(msg.author),
    rawAuthor: msg.author,
    private: msg.wasPrivate,
    recipients: msg.content.recps || msg.content.recipients, // backwards compatibility
    text: () => `${`${authorText()} ${highlightMentions(renderedMsg)}`}`,
    rawText: msg.content.text,
    lineLength: () => Math.ceil(
      (constants.TIME_FORMAT.length + 1 + state.getAuthor(msg.author).length + 1 + (msg.content.text.length || 0)) / currentWidth
    ),
    time: `${timeText}`,
    rawTime: msg.timestamp
  })
}

// action messages are like `/me is washing the dishes`
// it would look silly for that be like May 25 12:05 @squicc : @squicc is washing the dishes
// so we want to spruce it up a little bit
const action = (m) => {
  const msg = m.value
  const fromMe = msg.author === state.getMe()
  const authorText = () => c.bold[fromMe ? 'green' : color(msg.author)](state.getAuthor(msg.author))
  const timeText = `${c.gray.dim(format(msg.timestamp, constants.TIME_FORMAT))}`
  const renderedMsg = c.bold[fromMe ? 'green' : color(msg.author)](render(msg.content.text))

  const currentWidth = state.getWidth()

  return state.pushMessage({
    key: m.key,
    author: () => state.getAuthor(msg.author),
    rawAuthor: msg.author,
    private: msg.wasPrivate,
    recipients: msg.content.recps || msg.content.recipients, // backwards compatibility
    text: () => `${`${authorText()} ${highlightMentions(renderedMsg)}`}`,
    rawText: msg.content.text,
    lineLength: () => Math.ceil(
      (constants.TIME_FORMAT.length + 2 + state.getAuthor(msg.author).length + 2 + (msg.content.text.length || 0)) / currentWidth
    ),
    time: `${timeText}`,
    rawTime: msg.timestamp
  })
}

const system = (msg) => {
  return state.pushSystemMessage({
    text: () => `${`${c.bold.yellow(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), constants.TIME_FORMAT))}`}`,
    rawTime: Date.now()
  })
}

const error = (error) => {
  const msg = error.message
  return state.pushSystemMessage({
    text: () => `${`${c.bold.bgRed.white(msg)}`}`,
    rawText: msg,
    time: `${`${c.gray.dim(format(Date.now(), constants.TIME_FORMAT))}`}`,
    rawTime: Date.now()
  })
}

module.exports = {
  message,
  action,
  system,
  error
}
