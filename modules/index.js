const post = require('./post')
const invite = require('./invite')
const whoami = require('./whoami')
const follow = require('./follow')
const about = require('./about')
const privatePost = require('./private')
const unbox = require('./unbox')

module.exports = {
  about,
  post,
  invite,
  follow,
  whoami,
  private: privatePost,
  unbox
}
