const about = require('./about')
const follow = require('./follow')
const invite = require('./invite')
const post = require('./post')
const privatePost = require('./private')
const unbox = require('./unbox')
const whoami = require('./whoami')

module.exports = {
  about,
  follow,
  invite,
  post,
  private: privatePost,
  unbox,
  whoami
}
