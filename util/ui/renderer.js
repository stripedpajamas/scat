const emoji = require('node-emoji')
const tc = require('turbocolor')

const stylize = (m) => {
  let rendered = m
  // regex's for finding input with style indicating symbols
  const boldRegEx = /\*{2}[^*]+\*{2}/g
  const underlineRegEx = /__[^_]+__/g
  const italicRegEx = /_[^_]+_/g

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
