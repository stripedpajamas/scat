const tc = require('turbocolor')
const state = require('../state')

// header describing mode and potentially private recipients
const header = () => {
  const currentWidth = state.getWidth()
  const mode = state.getMode()
  const isPrivate = state.isPrivateMode()
  const scrolling = state.getScrolling()
  const isScrolling = scrolling.isScrolling
  const atTop = scrolling.atTop
  const recipients = state.getPrivateRecipientsNotMe()
  const leftHeaderText = `:: ${mode} MODE ${isPrivate ? `(${recipients.join(', ')}) ` : ''}:: ${isScrolling ? `(MESSAGE HISTORY${atTop ? ' - TOP' : ''})` : ''}`
  const notification = state.getLastNotification() || []
  const notificationRecipients = notification ? notification.map(state.getAuthor).join(', ') : ''
  const rightHeaderText = notificationRecipients && `Private msg from: ${notificationRecipients}`
  const leftHeader = isPrivate ? tc.bgBlack.white(leftHeaderText) : tc.bgWhite.black(leftHeaderText)
  const rightHeader = tc.bgYellow.black(rightHeaderText)
  const spacerWidth = currentWidth - leftHeaderText.length - rightHeaderText.length
  const spacer = ' '.repeat(spacerWidth > 0 ? spacerWidth : 1)
  return `${leftHeader}${spacer}${rightHeader}`
}

module.exports = header
