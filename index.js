const Diffy = require('diffy')
const pull = require('pull-stream')
const connect = require('ssb-client')
const colors = require('colorette')

const { gray, whiteBright: white, bold } = colors

const colorMap = {}

function randomColor () {
  const colorList = ['green', 'cyan', 'magenta', 'blue', 'red']
  return colorList[Math.floor(Math.random() * colorList.length)]
}

function getAuthorColor (author) {
  if (!colorMap[author]) {
    colorMap[author] = randomColor()
  }
  return colorMap[author]
}

function colorAuthor (author) {
  return `${bold(colors[getAuthorColor()](author))}`
}

constants = {
  DATE_TIME_OPTS: {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  },
  MESSAGE_TYPE: 'scat_message',
  ABOUT: 'about',
  CONTACT: 'contact',
  MODE: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },
  PROGRAM_DIR: '.scat',
  TIME_WINDOW: 7 * 24 * 60 * 60 * 1000, // 7 days
}

function getMaxVisibleMsgs () {
  return process.stdout.rows - 3
}

function getSpacer (msgsLength) {
  return '\n'.repeat(getMaxVisibleMsgs() - msgsLength)
}

function getPrintableMsgs (msgs) {
  return msgs.map(({ author, timestamp, text }) => `[${gray(timestamp)}] ${colorAuthor(author)}: ${white(text)}`).join('\n')
}

function processor (diffy) {
  const msgs = []

  // setup ui
  diffy.render(() => `${getPrintableMsgs(msgs)}${getSpacer(msgs.length)}\nINPUT MIGHT GO HERE >>>`)

  return (msg) => {
    if (msgs.length >= getMaxVisibleMsgs()) {
      msgs.shift()
    }
    if (!msg || !msg.value || !msg.value.content || msg.value.content.type !== constants.MESSAGE_TYPE) {
      return
    }
    const ts = new Date(msg.value.timestamp)
    const scatMsg = {
      timestamp: new Intl.DateTimeFormat('default', constants.DATE_TIME_OPTS).format(ts), // TODO allow timezone to be configured
      author: msg.value.author,
      text: msg.value.content.text
    }
    msgs.push(scatMsg)
    diffy.render()
  }
}

async function main () {
  connect((err, server) => {
    if (err) {
      console.error(err)
      return
    }

    const since = Date.now() - constants.TIME_WINDOW
    const diffy = Diffy({ fullscreen: true })
    pull(
      server.query.read({
        reverse: true,
        live: true,
        query: [{
          $filter: {
            value: {
              content: { type: constants.MESSAGE_TYPE },
              timestamp: { $gte: since }
            }
          }
        }]
      }),
      pull.drain(processor(diffy))
    )
  })
}

main()
