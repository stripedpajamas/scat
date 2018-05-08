let constants = require('./constants')

let me
let client
const authors = {}
let messages = []
let privateMessages = []
let currentMode = constants.MODE.PUBLIC

module.exports = {
  getClient: () => client,
  setClient: (c) => { client = c },
  getMe: () => me,
  setMe: (m) => { me = m },
  getAuthor: (author) => (authors[author] || {}).name || author,
  getAuthorId: (name) => {
    let n = name
    if (n.indexOf('@') === 0) {
      n = name.slice(1)
    }
    return Object.keys(authors).find(author => authors[author].name === n) || name
  },
  setAuthor: (author, name, setter) => {
    const alreadySet = authors[author]
    // if we already have this author set
    // and it was already set by the author itself
    // and we are trying to set it ourselves
    // make that happen
    if (alreadySet && alreadySet.setter === author && author !== setter) {
      authors[author] = { name, setter }
      return
    }
    // if any of that wasn't true, go ahead and set it
    authors[author] = { name, setter }
  },
  getAuthors: () => authors,
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
  getPrivateMessages: () => privateMessages,
  pushPrivateMessage: (msg) => privateMessages.push(msg),
  pushMessage: (msg) => {
    if (currentMode === constants.MODE.PRIVATE) privateMessages.push(msg)
    messages.push(msg)
  }
}
