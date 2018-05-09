let constants = require('./constants')

let me
let client
let messages = []
let privateMessages = []
let currentMode = constants.MODE.PUBLIC
const authors = {}

module.exports = {
  getClient: () => client,
  setClient: (c) => { client = c },
  getMe: () => me,
  setMe: (m) => { me = m },
  getAuthor: (author) => (authors[author] || {}).name || author,
  getAuthorId: (name) => Object.keys(authors).find(author =>
    authors[author].name === name || authors[author].name === `@${name}`) || name,
  setAuthor: (author, name, setter) => {
    let cleanName = name
    if (cleanName[0] !== '@') {
      cleanName = `@${cleanName}`
    }
    const alreadySet = authors[author]
    // if we already have this author set
    // and it was already set by the author itself
    // and we are trying to set it ourselves
    // make that happen
    if (alreadySet && alreadySet.setter === author && author !== setter) {
      authors[author] = { name: cleanName, setter }
      return
    }
    // if any of that wasn't true, go ahead and set it
    authors[author] = { name: cleanName, setter }
  },
  getAuthors: () => authors,
  // message mode stuff here
  isPrivateMode: () => currentMode === constants.MODE.PRIVATE,
  setPrivateMode: () => {
    privateMessages = []
    currentMode = constants.MODE.PRIVATE
  },
  setPublicMode: () => {
    privateMessages = []
    currentMode = constants.MODE.PUBLIC
  },
  pushPublicMessage: (msg) => messages.push(msg),
  getPublicMessages: () => messages,
  pushPrivateMessage: (msg) => privateMessages.push(msg),
  getPrivateMessages: () => privateMessages,
  // generic pusher for generic stuff
  pushMessage: (msg) => {
    if (currentMode === constants.MODE.PRIVATE) {
      privateMessages.push(msg)
      return
    }
    messages.push(msg)
  },
  // generic getter for generic stuff
  getMessages: () => {
    if (currentMode === constants.MODE.PRIVATE) {
      return privateMessages
    }
    return messages
  }
}
