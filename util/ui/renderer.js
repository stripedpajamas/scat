const emoji = require('node-emoji')

// adds any additional processing for the message text
const render = (m) => {
  if (typeof m === 'string') {
    // rendering emojis into messages
    const emojified = emoji.emojify(m, null, e => `${e} `)

    return emojified
  }

  return m
}

module.exports = render
