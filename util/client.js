const constants = require('./constants')
const sort = require('./sort')

let me
let client
let messages = []
let privateRecipients = []
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
  getMode: () => currentMode,
  isPrivateMode: () => currentMode === constants.MODE.PRIVATE,
  setPrivateMode: () => { currentMode = constants.MODE.PRIVATE },
  setPublicMode: () => { currentMode = constants.MODE.PUBLIC },
  pushMessage: (msg) => {
    messages.push(msg)
    // since private messages are processed async
    // we need to re-sort the messages array after receiving one
    if (msg.private) {
      sort(messages)
    }
  },
  getMessages: () => {
    if (currentMode === constants.MODE.PRIVATE) {
      // if in private mode, only show messages that are either from
      // the person/people i am in private mode with
      // OR from me that i sent to people i'm in private mode with
      // unfortunately because of how private messages work
      // this means i have to put the recipients list in the private scat message
      // will make note of this in the readme
      return messages.filter(msg => {
        const fromMe = msg.rawAuthor === me
        const inPrivateRecipients = privateRecipients.includes(msg.rawAuthor)
        const sentToYou = msg.recipients && msg.recipients.some(recipient => privateRecipients.includes(recipient))
        return msg.private && (inPrivateRecipients || (fromMe && sentToYou))
      })
    }
    return messages.filter(msg => !msg.private)
  },
  getPrivateRecipients: () => privateRecipients,
  setPrivateRecipients: (recipients) => { privateRecipients = recipients },
  getPrivateRecipientNames: () => privateRecipients.map(r => (authors[r] || {}).name || r)
}
