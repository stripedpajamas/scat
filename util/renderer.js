const emoji = require('node-emoji')

// adds any additional processing for the message text
const render = (m) => {
  // rendering emojis into messages
  const emojified = emoji.emojify(m, null, e => `${e} `)

  return emojified
}

module.exports = render
