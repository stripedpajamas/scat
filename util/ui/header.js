const tc = require('turbocolor')
const core = require('ssb-chat-core')
const state = require('../state')

// header describing mode and potentially private recipients
const header = () => {
  const currentWidth = state.getWidth()
  const mode = core.mode.get()
  const isPrivate = core.mode.isPrivate()
  const scrolling = state.getScrolling()
  const isScrolling = scrolling.isScrolling
  const atTop = scrolling.atTop
  const recipients = core.recipients.getNotMe()
  const leftHeaderText = `:: ${mode} MODE ${isPrivate ? `(${recipients.join(', ')}) ` : ''}:: ${isScrolling ? `(MESSAGE HISTORY${atTop ? ' - TOP' : ''})` : ''}`
  const unread = core.unreads.getLast()
  const unreadRecps = unread ? unread.map(core.authors.getName).join(', ') : ''
  const rightHeaderText = unreadRecps && `Private msg from: ${unreadRecps}`
  const leftHeader = isPrivate ? tc.bgBlack.white(leftHeaderText) : tc.bgWhite.black(leftHeaderText)
  const rightHeader = tc.bgYellow.black(rightHeaderText)
  const spacerWidth = currentWidth - leftHeaderText.length - rightHeaderText.length
  const spacer = ' '.repeat(spacerWidth > 0 ? spacerWidth : 1)
  return `${leftHeader}${spacer}${rightHeader}`
}

module.exports = header
