const Diffy = require('diffy')
const trim = require('diffy/trim')
const state = require('../state')
const header = require('./header')
const input = require('./input')

const diffy = Diffy({ fullscreen: !process.argv.includes('--debug') })

// rerender while i type
input.on('update', () => {
  diffy.render()
  state.setInput(input.line())
})

// update state with dimensions on resize
diffy.on('resize', () => {
  state.setViewport(diffy.width, diffy.height)
})

const prompter = () => (
  diffy.render(() => {
    const messages = state.getViewableMessages()
    const systemMessage = state.getSystemMessage()
    return trim(`
      ${header()}
      ${messages.join('\n')}
      ${systemMessage ? `${systemMessage.time}  ${systemMessage.text()}` : ''}
      > ${input.line()}
    `)
  })
)

module.exports = () => {
  state.setViewport(diffy.width, diffy.height)
  prompter()
  setInterval(() => diffy.render(), 100)
}
