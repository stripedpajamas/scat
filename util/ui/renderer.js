const emoji = require('node-emoji')
const tc = require('turbocolor')

const stylize = (m) => {
  let rendered = m
  // regex's for finding input with stylized declaring symbols
  const boldRegEx = /\*[^*]+\*/g
  const underlineRegEx = /__[^_]+__/g
  const italicRegEx = /_[^_]+_/g

  // matches for stylized input
  const boldMatches = rendered.match(boldRegEx)
  const underlineMatches = rendered.match(underlineRegEx)
  const italicMatches = rendered.match(italicRegEx)

  // checking if there are matches. if there are then we are
  // replacing the match with the stylized version, removing symbols
  if (boldMatches) {
    boldMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.bold(match.replace(/\*/g, '')))
    })
  }

  if (underlineMatches) {
    underlineMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.underline(match.replace(/_/g, '')))
    })
  }

  if (italicMatches) {
    italicMatches.forEach((match) => {
      rendered = rendered.replace(match, tc.italic(match.replace(/_/g, '')))
    })
  }

  return rendered
}

// adds any additional processing for the message text
const render = (m) => {
  let rendered = m

  if (typeof m === 'string') {
    // check for any text stylizing
    rendered = stylize(rendered)
    // rendering emojis into messages
    rendered = emoji.emojify(rendered, null, e => `${e} `)
  }

  return rendered
}

module.exports = render
