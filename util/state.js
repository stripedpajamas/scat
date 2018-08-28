const core = require('ssb-chat-core')
const constants = require('./constants')

// #region initial state
let args = {}
let viewport = {}
let scrolling = {
  isScrolling: false,
  atTop: false,
  atBottom: true,
  index: 0
}
let input = ''
let viewableMessages = []
let systemMessage = null
let lastInput = ''
let trueUnreads = core.unreads.get().toJS()
// #endregion

// #region args actions
const getArgs = () => args
const setArgs = (val) => { args = val }
// #endregion

// #region input actions
const setInput = (value) => { input = value }
const getInputLinesLength = () => {
  // input length is `> `(2) + input.length
  // how many lines is that in my terminal?
  // Math.ceil(length / viewport.w)
  return Math.ceil((2 + input.length) / viewport.w)
}
// #endregion

// #region view actions
const setViewport = (w, h) => {
  viewport.w = w
  viewport.h = h
  viewport.showLines = h - 6
}
const getWidth = () => viewport.w
const viewPageUp = () => {
  const filteredMessages = core.messages.get()
  if (scrolling.atTop || filteredMessages.size < viewport.showLines) {
    return
  }

  scrolling.isScrolling = true
  scrolling.index = (scrolling.index || filteredMessages.size) - viewableMessages.length - 1
  // are we at the top? (would one more scroll up show no messages)
  scrolling.atTop = (scrolling.index || filteredMessages.size) - viewableMessages.length - 1 < 1
}
const viewPageDown = () => {
  const filteredMessages = core.messages.get()
  if (scrolling.atBottom) return

  if (scrolling.index >= 0) {
    scrolling.index += Math.max(viewableMessages.length, viewport.h - viewableMessages.length)
    scrolling.atTop = (scrolling.index || filteredMessages.size) - viewableMessages.length - 1 < 1
  }
}
const getScrolling = () => scrolling
const lineLength = (msg) => {
  return Math.ceil(
    (constants.TIME_FORMAT.length + 2 + msg.get('authorName')().length + 1 + (msg.get('text').length || 0)) / viewport.w
  )
}
const getViewableMessages = () => {
  // determine where to start in the messages array
  const filteredMessages = core.messages.get()
  let start = filteredMessages.size - 1
  if (scrolling.isScrolling) {
    if (scrolling.index > filteredMessages.size - 1) {
      scrolling.atBottom = true
      scrolling.isScrolling = false
    } else {
      start = scrolling.index
      scrolling.atBottom = false
    }
  }

  const inputLines = getInputLinesLength()

  // set the viewable messages
  const viewable = []
  let viewableLines = inputLines

  for (let i = start; i >= 0; i--) {
    const current = filteredMessages && filteredMessages.get(i)
    if (current) {
      const currentLineLength = lineLength(current)
      const totalLines = viewableLines + currentLineLength + inputLines
      if (totalLines > viewport.showLines) {
        break
      }
      viewable.push(current)
      viewableLines += currentLineLength
    }
  }

  viewableMessages = viewable.reverse()
  return viewableMessages
}
// #endregion

// #region message actions
const pushSystemMessage = (msg) => { systemMessage = msg }
const getSystemMessage = () => systemMessage
const resetSystemMessage = () => { systemMessage = null }
// #endregion

// #region input actions
const getLastInput = () => lastInput
const setLastInput = (input) => {
  lastInput = input
}
// #endregion

// #region unreads
core.events.on('unreads-changed', (unreads) => {
  const newUnreads = []
  unreads.forEach((unread) => { // an unread is an array of IDs
    // see if we're currently in private mode with these humyns
    const currentRecipients = core.recipients.get()
      .filter(r => r !== core.me.get())
    const talkingToThem = core.recipients.compare(currentRecipients, unread)
    const inPrivateMode = core.mode.isPrivate()
    // if we aren't in private mode
    // or we are in private mode but with other people
    if (!inPrivateMode || !talkingToThem) {
      newUnreads.push(unread)
    }
    // on the other hand, if we are talking to them
    // we should mark these as read in core
    if (inPrivateMode && talkingToThem) {
      core.unreads.setAsRead(currentRecipients)
    }
    return true
  })
  trueUnreads = newUnreads
})
const getUnreads = () => trueUnreads
const getLastUnread = () => trueUnreads[trueUnreads.length - 1]
// #endregion

module.exports = {
  setArgs,
  getArgs,
  setViewport,
  viewPageUp,
  viewPageDown,
  setInput,
  getInputLinesLength,
  getViewableMessages,
  getWidth,
  getScrolling,
  pushSystemMessage,
  getSystemMessage,
  resetSystemMessage,
  getLastInput,
  setLastInput,
  getUnreads,
  getLastUnread
}
