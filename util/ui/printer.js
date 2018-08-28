const c = require('colorette')
const format = require('date-fns/format')
const state = require('../state')
const constants = require('../constants')

const { bold, yellow, gray, dim, bgRed, white } = c

const system = (msg) => {
  return state.pushSystemMessage({
    text: () => bold(yellow(msg)),
    rawText: msg,
    time: gray(dim(format(Date.now(), constants.TIME_FORMAT))),
    rawTime: Date.now()
  })
}

const error = (error) => {
  const msg = error.message
  return state.pushSystemMessage({
    text: () => bold(bgRed(white(msg))),
    rawText: msg,
    time: gray(dim(format(Date.now(), constants.TIME_FORMAT))),
    rawTime: Date.now()
  })
}

module.exports = {
  system,
  error
}
