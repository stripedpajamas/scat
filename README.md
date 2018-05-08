# :mouse: scat :mouse:
tiny chat-like cli built on scuttlebutt

more on scuttlebutt: https://www.scuttlebutt.nz/

potentially chat with friends on the same network without even being connected to the internet :raised_hands:


### install / run
```bash
$ npm i -g ssb-chat
  ...
$ scat
```

### usage
```
$ scat
joel : what's up
pete : not much
...
> type a message and hit enter and it will publish a scat_message to your feed

# to join a pub server:
> /pub invite-code

# to self-identify:
> /name name

# to identify someone else:
> /identify @id name

# to send a private message:
> /private @id,...,@id msg

# to follow someone
> /follow @id

# to unfollow someone
> /unfollow @id

# to look up someone's id
> /whois name

# to look up your own id
> /whoami
```

### what's happening
scat uses a special message type `scat_message`. this means that if you're using something like [Patchwork](https://github.com/ssbc/patchwork), your feed won't be all gobbled up by chat messages. And scat won't be all gobbled up by your posts. 

but since it's all the same protocol and all the same feeds, all the same people are there. scat looks for `about` messages to show a user's name instead of their id, but falls back to the id if necessary.

scat will honor self-identification above a 3rd party's identification of another user, and scat will honor your identification of another user above their own self-identification. a 3rd party's identification of another user is not honored at all.

scat supports sending private scat messages. it will auto-add your id to the recipients list so that you are able to see your own private messages. 

### license
MIT
