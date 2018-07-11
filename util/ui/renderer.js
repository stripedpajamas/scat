const emoji = require('node-emoji')

// adds any additional processing for the message text
const render = (m) => {
  let rendered = m
  if (typeof m === 'string') {
    // rendering emojis into messages
    rendered = emoji.emojify(rendered, null, e => `${e} `)
  }

  return rendered
}

module.exports = render
