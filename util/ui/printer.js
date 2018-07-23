const tc = require('turbocolor')
const format = require('date-fns/format')
const state = require('../state')
const constants = require('../constants')

const system = (msg) => {
  return state.pushSystemMessage({
    text: () => tc.bold.yellow(msg),
    rawText: msg,
    time: tc.gray.dim(format(Date.now(), constants.TIME_FORMAT)),
    rawTime: Date.now()
  })
}

const error = (error) => {
  const msg = error.message
  return state.pushSystemMessage({
    text: () => tc.bold.bgRed.white(msg),
    rawText: msg,
    time: tc.gray.dim(format(Date.now(), constants.TIME_FORMAT)),
    rawTime: Date.now()
  })
}

module.exports = {
  system,
  error
}
