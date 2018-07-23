const emojis = require('node-emoji')
const core = require('ssb-chat-core')
const constants = require('./constants')

const emojiList = Object.keys(emojis.emoji).map(e => `:${e}:`)

const author = (partial) => core.authors.get()
    .map(nameMap => nameMap.get('name'))
    .filter(name => name.startsWith(partial))
    .toArray()

const command = (partial) => constants.COMMANDS.filter(cmd => cmd.startsWith(partial))

const emoji = (partial) => {
  const possibleDups = {}
  // finding emojis that start with the partial
  // we want to show these as options first
  const startEmojis = emojiList.filter(em => em.startsWith(partial))
  // adding them to the duplicates object
  startEmojis.forEach((e) => { possibleDups[e] = true })

  // finding emojis that contain the partial
  // removing emojis that start with the partial so there aren't duplicates
  const partialEmojis = emojiList.filter(em => em.includes(partial.slice(1)) && !possibleDups[em])
  // returning the emojis that start with the partial and then the emojis that contain the partial
  return startEmojis.concat(partialEmojis)
}

module.exports = (line) => {
  const split = line.split(' ')
  let beginning = split.slice(0, split.length - 1).join(' ')
  let lastWord = split[split.length - 1]
  let matches = []

  if (split.length === 1 && lastWord.indexOf('/') === 0) { // command
    matches = command(lastWord)
  } else if (lastWord.indexOf(':') === 0) { // emoji
    matches = emoji(lastWord)
  } else {
    // if they didn't include an @ symbol, put one on
    if (lastWord.indexOf('@') !== 0) {
      lastWord = `@${lastWord}`
    }

    matches = author(lastWord)
  }

  // keep a separation between what's being tab-completed and what came before
  if (beginning) {
    beginning = `${beginning} `
  }

  let idx = -1
  return () => (matches.length && `${beginning}${matches[++idx % matches.length]}`) || line
}
