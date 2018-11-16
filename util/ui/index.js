const core = require('ssb-chat-core')
const Diffy = require('diffy')
const trim = require('diffy/trim')
const state = require('../state')
const header = require('./header')
const input = require('./input')
const render = require('./renderer')

let diffy

const prompter = () => (
  diffy.render(() => {
    const messages = state.getViewableMessages()
    const systemMessage = state.getSystemMessage()
    return trim(`
      ${header()}
      ${messages.map(render).join('\n')}
      ${systemMessage ? `${systemMessage.time} ${systemMessage.text()}` : ''}
      > ${input.line()}
    `)
  })
)

module.exports = (opts) => {
  if (!opts.quiet) {
    diffy = Diffy({ fullscreen: !opts.debug })

    // rerender while i type
    input.on('update', () => {
      diffy.render()
      state.setInput(input.line())
    })

    // update state with dimensions on resize
    diffy.on('resize', () => {
      state.setViewport(diffy.width, diffy.height)
    })

    state.setViewport(diffy.width, diffy.height)
    prompter()

    core.events.on('*', () => diffy.render())
  } else {
    // quiet mode is for testing
    // it doesn't start Diffy but calls most of the same methods
    core.events.on('*', () => {
      header()
      state.getViewableMessages()
      state.getSystemMessage()
    })
  }
}
