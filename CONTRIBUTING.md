# Contribution guidelines

thank you for wanting to contribute :smile:

### running from source
scat requires >= Node LTS and currently doesn't support Node 10 because of the leveldown dependency

Get the code and install dependencies: 
```bash
$ git clone https://github.com/stripedpajamas/scat.git
$ cd scat
$ npm install
```

to run scat from source:
```bash
npm start
```

if you're playing around, i recommend either sending private messages to yourself (e.g. `/private @your-name`) or spinning up a new test SSB identity.
i usually do the former, but when i need to do the latter, i copy `~/.ssb` to `~/.ssb-good`, so launching scat (which launches sbot) creates a new `~/.ssb` folder/indentity.

### pull requests
if there isn't an existing issue for the problem/feature your PR is for, open one so it can get some discussion and you don't waste time. then link to it in your PR.

make sure your code is [Standard](https://github.com/standard/standard)-linted.

### structure
currently, everything that interacts with `sbot` is in the `modules/` folder. almost all of the other logic is in `util/`. i tried to keep most/all text in the `constants.js` file so they could be changed in one place if necessary.
