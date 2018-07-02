module.exports = {
  MESSAGE_TYPE: 'scat_message',
  ABOUT: 'about',
  CONTACT: 'contact',
  MODE: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },
  PROGRAM_DIR: '.scat',
  TIME_WINDOW: 604800000,
  COMMANDS: [
    '/clear',
    '/follow',
    '/help',
    '/identify',
    '/name',
    '/notifications',
    '/private',
    '/pub',
    '/quit',
    '/say',
    '/unfollow',
    '/whoami',
    '/whois'
  ],
  COMMAND_TEXT: {
    INVALID: 'Invalid command. Type / and tab to cycle through options or type /help for a list.',
    QUIT: {
      FROM_PUBLIC: '/quit leaves private mode. To exit the program press Control-C'
    },
    PUB: {
      SUCCESS: 'Pub joined successfully',
      FAILURE: 'Could not join pub'
    },
    NAME: {
      SUCCESS: 'Name set successfully',
      FAILURE: 'Could not set name'
    },
    WHOAMI: {
      FAILURE: 'Could not figure out who you are'
    },
    PRIVATE: {
      NO_RECIPIENTS: 'You must specify recipients: /private @recipient1, @recipient2, ...',
      TOO_MANY_RECIPIENTS: 'You can only send a private message to up to 7 recipients',
      INVALID_FEED_IDS: 'Could not determine feed ids for all recipients'
    }
  },
  HELP: {
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

    notifications: 'To see unread notifications: /notifications',
    '/notifications': 'To see unread notifications: /notifications',

    clear: 'To reset unread notifications: /clear',
    '/clear': 'To reset unread notifications: /clear',

    private: 'To enter private mode: /private @recipient1, @recipient2, ...',
    '/private': 'To enter private mode: /private @recipient1, @recipient2, ...',

    quit: 'To quit private mode: /quit',
    '/quit': 'To quit private mode: /quit'
  }
}
