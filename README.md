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
> /name name to self-identify
```

### what's happening
scat uses a special message type `scat_message`. this means that if you're using something like [Patchwork](https://github.com/ssbc/patchwork), your feed won't be all gobbled up by chat messages. And scat won't be all gobbled up by your posts. 

But since it's all the same protocol and all the same feeds, all the same people are there. scat looks for `about` messages to show a uxer's name instead of their id, but falls back to the id if necessary.

`/name myname` publishes an `about` message to your feed, just like self-identifying in Patchwork. 

`/pub invite-code` joins a pub server as you would expect, so you can chat through the internet.

### license
MIT
