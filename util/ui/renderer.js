const emoji = require('node-emoji')
const tc = require('turbocolor')
const formatTime = require('date-fns/format')
const core = require('ssb-chat-core')
const constants = require('../constants')
const color = require('./color')

// regex's for finding input with style indicating symbols
const boldRegEx = /\*[^*]+\*/g
const underlineRegEx = /__[^_]+__/g
const italicRegEx = /_[^_]+_/g

const stylize = (m) => {
  let rendered = m

  // matching for style indicating input. if there are matches then we
  // are replacing the match with the stylized version, removing symbols
  const underlineMatches = rendered.match(underlineRegEx)
  if (underlineMatches) {
    underlineMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.underline(match.replace(/_/g, '')))
    })
  }

  const italicMatches = rendered.match(italicRegEx)
  if (italicMatches) {
    italicMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.italic(match.replace(/_/g, '')))
    })
  }

  const boldMatches = rendered.match(boldRegEx)
  if (boldMatches) {
    boldMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.bold(match.replace(/\*/g, '')))
    })
  }

  return rendered
}

const highlightMentions = (text) => {
  // color me if i was mentioned
  let highlighted = text
  if (typeof highlighted === 'string') {
    core.me.names().forEach((me) => {
      highlighted = highlighted.split(' ').map((word) => {
        if (word === me) {
          return tc.bgMagenta.black(word)
        }
        return word
      }).join(' ')
    })
  }
  return highlighted
}

// adds any additional processing for the message text
const render = (m) => {
  let renderedText = m.get('text')

  if (typeof renderedText === 'string') {
    // rendering emojis into messages
    renderedText = emoji.emojify(renderedText, null, e => `${e} `)
    // check for any text stylizing
    renderedText = stylize(renderedText)
  }

  if (m.get('action')) {
    renderedText = tc.bold[m.get('fromMe') ? 'green' : color(m.get('author'))](renderedText)
  }

  const time = tc.gray.dim(formatTime(m.get('timestamp'), constants.TIME_FORMAT))
  const author = () => tc.bold[m.get('fromMe') ? 'green' : color(m.get('author'))](m.get('authorName')())
  const text = () => highlightMentions(renderedText)

  return `${time}  ${author()} ${text()}`
}

module.exports = render
