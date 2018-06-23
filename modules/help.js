module.exports = () => {
  return new Promise((resolve, reject) => {
    var helpText = '\n' +
                    '# to join a pub server:\n' +
                    '> /pub invite-code\n' +
                    '\n' +
                    '# to self-identify:\n' +
                    '> /name name\n' +
                    '\n' +
                    '# to identify someone else:\n' +
                    '> /identify @id name\n' +
                    '\n' +
                    '# to follow someone\n' +
                    '> /follow @id\n' +
                    '\n' +
                    '# to unfollow someone\n' +
                    '> /unfollow @id\n' +
                    '\n' +
                    '# to look up someones id\n' +
                    '> /whois @name\n' +
                    '\n' +
                    '# to look up your own id\n' +
                    '> /whoami\n' +
                    '\n' +
                    '# to see unread notifications\n' +
                    '> /notifications\n' +
                    '\n' +
                    '# to reset unread notifications\n' +
                    '> /clear\n' +
                    '\n' +
                    '# to enter private mode\n' +
                    '> /private @recipient1, @recipient2, ...\n' +
                    '\n' +
                    '# to quit private mode\n' +
                    '> /quit\n'
    resolve(helpText)
  })
}
