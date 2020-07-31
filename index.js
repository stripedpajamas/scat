const Diffy = require('diffy')
const input = require('diffy/input')()
const pino = require('pino')
const pull = require('pull-stream')
const connect = require('ssb-client')
const colors = require('colorette')

const dbg = pino(pino.destination(2)) // log to stderr

const constants = {
  SYSTEM: '<scat>',
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
  MODE: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },
  PROGRAM_DIR: '.scat',
  TIME_WINDOW: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const { gray, whiteBright: white, bold, black, bgWhite, bgYellow } = colors

const colorMap = {}
const nameMap = {}

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
  return `${bold(colors[getAuthorColor(author)](author))}`
}

function getMaxVisibleMsgs () {
  return process.stdout.rows - 3
}

function getSpacer (msgsLength) {
  return '\n'.repeat(getMaxVisibleMsgs() - msgsLength)
}

function getPrintableMsgs (msgs) {
  return msgs.map(({ author, timestamp, text }) => {
    const textFormatted = author === constants.SYSTEM ? bgYellow(black(text)) : white(text)
    return `[${gray(timestamp)}] ${colorAuthor(author)}: ${textFormatted}`
  }).join('\n')
}

function ts (timestamp) {
  const ts = new Date(timestamp)
  return new Intl.DateTimeFormat('default', constants.DATE_TIME_OPTS).format(ts) // TODO allow timezone to be configured
}

async function processor (diffy, server) {
  const msgs = []
  const meId = server.id

  // setup ui
  diffy.render(() => `${getPrintableMsgs(msgs)}${getSpacer(msgs.length)}\n> ${input.line()}`)

  return {
    incoming: (msg) => {
      if (msgs.length >= getMaxVisibleMsgs()) {
        msgs.shift()
      }
      if (!msg || !msg.value || !msg.value.content || msg.value.content.type !== constants.MESSAGE_TYPE) {
        return
      }
      if (!nameMap[msg.value.author] && server.about) {
        server.about.socialValue({ key: 'name', dest: msg.value.author })
          .then((authorName) => {
            nameMap[msg.value.author] = authorName
            for (let existingMsg of msgs) {
              if (existingMsg.author === msg.value.author) existingMsg.author = authorName
            }
            if (colorMap[msg.value.author]) colorMap[authorName] = colorMap[msg.value.author]
            diffy.render()
          })
          .catch((err) => {
            dbg.error(err)
          })
      }
        
      const scatMsg = {
        timestamp: ts(msg.value.timestamp),
        author: nameMap[msg.value.author] || msg.value.author,
        text: msg.value.content.text
      }
      msgs.push(scatMsg)
      diffy.render()
    },
    outgoing: (line) => {
      // handle commands
      if (line && line[0] === '/') {
        const wordBreak = line.indexOf(' ')
        const cmdEnd = wordBreak > 0 ? wordBreak : line.length
        switch (line.substring(1, cmdEnd)) {
          case 'debug': {
            dbg.info({ colorMap, msgs })
            break
          }
        }
      } else {
        server.publish({ type: constants.MESSAGE_TYPE, text: line })
          .catch((err) => {
            msgs.push({ timestamp: ts(Date.now()), author: constants.SYSTEM, text: 'Failed to post message.' })
            diffy.render()
            dbg.error(err)
          })
      }
    }
  }
}

async function main () {
  let server
  try {
    server = await connect()
  } catch (err) {
    console.error(err)
  }

  const since = Date.now() - constants.TIME_WINDOW
  const diffy = Diffy({ fullscreen: true })
  const { incoming, outgoing } = await processor(diffy, server)
  // setup input listeners
  input.on('update', () => diffy.render())
  input.on('enter', outgoing)

  // pull data from sbot
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
    pull.drain(incoming)
  )
}

main()
