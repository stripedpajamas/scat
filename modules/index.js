const about = require('./about')
const follow = require('./follow')
const help = require('./help')
const invite = require('./invite')
const post = require('./post')
const privatePost = require('./private')
const unbox = require('./unbox')
const whoami = require('./whoami')

module.exports = {
  about,
  follow,
  help,
  invite,
  post,
  private: privatePost,
  unbox,
  whoami
}
