# I Really Hate Money

This is a really tiny app to ease the shared houses and travels budget management.
Keep track of who bought what, when and for whom.

I-Really-Hate-Money is a reboot of [ihatemoney](http://ihatemoney.org).
It differs from the original project by a mobile and offline-first approach.

I-Really-Hate-Money also serves as a test bench for [kinto](http://kinto.readthedocs.org) and [kinto.js](http://kintojs.readthedocs.org).
It is currently under development.

## How to install

    $ npm install


## How to run

    $ npm start

Currently, we use Mozilla's kinto server for synchronization (data is erased every night).
You can set another kinto server using the `server` constant in `index.js`.


## How to deploy

   Coming soon(ish)