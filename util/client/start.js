let server

process.on('message', (msg) => {
  if (msg.config) {
    start(msg.config)
  }
  if (msg.stop) {
    if (server && server.stop) {
      server.stop()
    }
    process.exit(0)
  }
})

const path = require('path')
const fs = require('fs')

const start = (config) => {
  const manifestFile = path.join(config.path, 'manifest.json')

  const createSbot = require('scuttlebot')
    .use(require('scuttlebot/plugins/master'))
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('scuttlebot/plugins/replicate'))
    .use(require('scuttlebot/plugins/invite'))
    .use(require('scuttlebot/plugins/local'))
    .use(require('ssb-about'))
    .use(require('ssb-backlinks'))
    .use(require('ssb-blobs'))
    .use(require('ssb-ebt'))
    .use(require('ssb-friends'))
    .use(require('ssb-meme'))
    .use(require('ssb-names'))
    .use(require('ssb-ooo'))
    .use(require('ssb-private'))
    .use(require('ssb-search'))
    .use(require('ssb-query'))
    .use(require('ssb-ws'))

  // start server
  server = createSbot(config)

  // write RPC manifest to ~/.ssb/manifest.json
  fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))
}
