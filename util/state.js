const constants = require('./constants')
const sort = require('./sort')
const compare = require('./compare')

let me
let client
let messages = []
let privateRecipients = []
let notifications = []
let currentMode = constants.MODE.PUBLIC
let systemMessage = null
const authors = {}

/* client */
const getClient = () => client
const setClient = (c) => { client = c }

/* me */
const getMe = () => me
const setMe = (m) => { me = m }

/* author */
const getAuthor = (author) => (authors[author] || {}).name || author
const getAuthors = () => authors
const getAuthorId = (name) => Object.keys(authors).find(author =>
  authors[author].name === name || authors[author].name === `@${name}`) || name
const setAuthor = (author, name, setter) => {
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
}

/* mode */
const getMode = () => currentMode
const isPrivateMode = () => currentMode === constants.MODE.PRIVATE
const setPrivateMode = () => {
  currentMode = constants.MODE.PRIVATE
  resetSystemMessage()
}
const setPublicMode = () => {
  currentMode = constants.MODE.PUBLIC
  resetPrivateRecipients()
  resetSystemMessage()
}

/* message */
const pushMessage = (msg) => {
  // if a new message comes in, clear any system messages so things don't get confusing
  resetSystemMessage()
  messages.push(msg)
  // since private messages are processed async
  // we need to re-sort the messages array after receiving one
  if (msg.private) {
    sort(messages)

    // also if this wasn't sent by us
    if (msg.recipients && msg.rawAuthor !== me) {
      // see if we're currently in private mode with the recipients
      const talkingToThem = compare(privateRecipients, msg.recipients)

      // if we aren't in private mode
      // or we are in private mode but with other people
      if (!isPrivateMode() || !talkingToThem) {
        // see if these recipients are already in a notification
        const notificationRecipients = msg.recipients.filter(r => r !== me)
        const alreadyNotified = notifications.some(n => compare(n, notificationRecipients))

        // if we haven't already notified about this user sending us something
        if (!alreadyNotified) {
          // then push a notification
          notifications.push(notificationRecipients)
        }
      }
    }
  }
}
const getMessages = () => {
  if (isPrivateMode()) {
    // if in private mode, only show messages that are either from
    // the person/people i am in private mode with
    // OR from me that i sent to people i'm in private mode with
    // unfortunately because of how private messages work
    // this means i have to put the recipients list in the private scat message
    // will make note of this in the readme
    return messages.filter(msg => msg.private && compare(msg.recipients || [], privateRecipients))
  }
  return messages.filter(msg => !msg.private)
}
const pushSystemMessage = (msg) => { systemMessage = msg }
const getSystemMessage = () => systemMessage
const resetSystemMessage = () => { systemMessage = null }

/* recipients */
const getPrivateRecipients = () => privateRecipients
const setPrivateRecipients = (recipients) => {
  const uniqueRecipients = new Set(recipients)
  uniqueRecipients.add(me)

  const recipientsArray = [...uniqueRecipients]

  clearNotification(recipientsArray)
  privateRecipients = recipientsArray

  setPrivateMode()
}
const resetPrivateRecipients = () => { privateRecipients = [] }
const getPrivateRecipientsNotMe = () => privateRecipients.filter(pr => pr !== getMe()).map(getAuthor)

/* notifications */
const getNotifications = () => notifications
const getLastNotification = () => notifications[notifications.length - 1] || []
const clearNotification = (recipients) => {
  // when we create a notification, we leave off our own username
  // so to clear a notification we need to take our own username off the criteria
  const filteredRecipients = recipients.filter(r => r !== getMe())
  notifications = notifications.filter(notificationRecipients => !compare(filteredRecipients, notificationRecipients))
}
const resetNotifications = () => { notifications = [] }

module.exports = {
  getClient,
  setClient,
  getMe,
  setMe,
  getAuthor,
  getAuthors,
  getAuthorId,
  setAuthor,
  getMode,
  isPrivateMode,
  setPrivateMode,
  setPublicMode,
  pushMessage,
  getMessages,
  pushSystemMessage,
  getSystemMessage,
  resetSystemMessage,
  getPrivateRecipients,
  getPrivateRecipientsNotMe,
  setPrivateRecipients,
  resetPrivateRecipients,
  getNotifications,
  getLastNotification,
  clearNotification,
  resetNotifications
}
