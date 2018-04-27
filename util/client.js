let me
let client
const authors = {}

module.exports = {
  getClient: () => client,
  setClient: (c) => { client = c },
  getMe: () => me,
  setMe: (m) => { me = m },
  getAuthor: (author) => authors[author] || author,
  getAuthorId: (name) => Object.keys(authors).find(author => authors[author] === name) || name,
  setAuthor: (author, name) => { authors[author] = name }
}
