const state = require('./state')
const commander = require('./commander')

const author = (partial) => {
  const authors = state.getAuthors()
  const names = Object.values(authors).map(obj => obj.name)

  return names.filter(name => name.startsWith(partial))
}

const command = (partial) => {
  const commands = Object.keys(commander.commands)
  return commands.filter(cmd => cmd.startsWith(partial))
}

module.exports = (line) => {
  const split = line.split(' ')
  let beginning = split.slice(0, split.length - 1).join(' ')
  let lastWord = split[split.length - 1]
  let matches = []

  if (split.length === 1 && lastWord.indexOf('/') === 0) { // command
    matches = command(lastWord)
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
