module.exports = {
  MESSAGE_TYPE: 'scat_message',
  ABOUT: 'about',
  CONTACT: 'contact',
  MODE: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },
  TIME_FORMAT: 'MMM DD HH:mm',
  PROGRAM_DIR: '.scat',
  TIME_WINDOW: 7 * 24 * 60 * 60 * 1000,
  COMMANDS: [
    '/follow',
    '/help',
    '/identify',
    '/name',
    '/unreads',
    '/private',
    '/pub',
    '/quit',
    '/say',
    '/unfollow',
    '/whoami',
    '/whois'
  ],
  HELP: {
    COMMAND_NOT_FOUND: 'Invalid command. Type / and tab to cycle through options or type /help for a list.',
    SUMMARY: 'Available commands: /clear, /follow, /help, /identify, /name, /notifications, /private, /pub, /quit, /unfollow, /whoami, /whois. Type /help <cmd> for more info.',
    NOT_FOUND: 'Help for command not found. Type /help for list of available commands.',

    pub: 'To join a pub server: /pub <invite-code>',
    '/pub': 'To join a pub server: /pub <invite-code>',

    name: 'To set your name: /name <name>',
    '/name': 'To set your name: /name <name>',

    identify: 'To identify someone else: /identify @id name',
    '/identify': 'To identify someone else: /identify @id name',

    follow: 'To follow someone: /follow @id',
    '/follow': 'To follow someone: /follow @id',

    unfollow: 'To unfollow someone: /unfollow @id',
    '/unfollow': 'To unfollow someone: /unfollow @id',

    whois: 'To look up someone\'s id: /whois name',
    '/whois': 'To look up someone\'s id: /whois name',

    whoami: 'To look up your own id: /whoami',
    '/whoami': 'To look up your own id: /whoami',

    unreads: 'To see unread messages: /unreads',
    '/unreads': 'To see unread messages: /unreads',

    private: 'To enter private mode: /private @recipient1, @recipient2, ...',
    '/private': 'To enter private mode: /private @recipient1, @recipient2, ...',

    quit: 'To quit private mode: /quit',
    '/quit': 'To quit private mode: /quit'
  }
}
