Last week we released the next big version of Hypercore, our distributed, scalable append-only log.

We thought we'd take the opportunity to describe some of the changes and exciting new features. Hopefully, it will become a tradition to write these kinds of posts for each major release!

## What is Hypercore?

If you are not familiar with the basics of Hypercore, first [check it out here](https://github.com/mafintosh/hypercore).

Hypercore is an append-only log that is really good at replicating data. Its greatest feature is its flexibility: you can use it as a foundation for building other distributed data structures on top, without having to reimplement a ton of tricky peer-to-peer replication code.

At first glace the API is quite straight forward. It's basically a distributed list that you can append data to and read data out of.

``` js
hypercore.key // a public key that verifies the data structure
hypercore.append('data') // add new data to the list
hypercore.get(0, (err, data) => { ... }) // read an entry
```

Only the original creator of a Hypercore can append new data, making it a single-writer data structure. You can, however, build out powerful multi-writer data structures by using multiple Hypercores that reference each other's elements, if you need it. When consuming a big list of data you can choose to only download and verify data you are reading, making it good at sparse and random-access replication.

The ecosystem around Hypercore consists of many projects, but the core ones where I spend the most time are:

* [Hyperdrive](https://github.com/hyperdrive) - A filesystem abstraction that runs on top of Hypercore
* [Beaker](https://beakerbrowser.com) - A Hyperdrive browser
* [Hypertrie](https://github.com/mafintosh/hypertrie) - A scalable key/value store on top of Hypercore
* [Hyperswarm](https://github.com/hyperswarm) - A P2P swarm that abstracts away complex P2P networking

## What's new in v8?

Hypercore has been around for years and in general has been quite stable. That said, there has always been room for improvement to the wire protocol, and this is that we've focused on in v8.

Hypercore <=7 uses a basic encryption scheme focused around the original use-cases: Hypercore keys are not derivable from their discovery keys, and can therefore be treated as shared capabilities. Hypercore will blindly replicate with anyone who can provably demonstrate that they have the key.

Although a simple scheme, this had known drawbacks such as no forward secrecy and no way of knowing who you are replicating with securely.

Since the we started the project, modular approaches to setting up cryptographic channels between peers have matured. In v8 we use one such approach called Noise. Noise is framework for exchanging a series of messages in a standardised fashion that allows you to create an encrypted channel with the exact cryptographic properties you are looking for.

### Noise Peer Authentication

v8's updated wire protocol is bootstrapped using a [Noise protocol framework](http://www.noiseprotocol.org) XX handshake, which requires that both sides of the connection can be fully authenticated using static key pairs.

This means that in v8, you can be cryptographically certain that you're talking to a known, trusted peer before continuing beyond the handshake. We're excited by the new types of applications that private sharing can enable.

The feature is opt-in, meaning that to do anonymous browsing a unique key pair can still be generated for each session.

Noise is also well-tested in the real world and with it our encrypted protocol stream is forward-secure.

The update to Noise means that our replication API signature changes as well.

In Hypercore <=7 you would produce a replication stream like so:

```
const stream = v7feed.replicate()
```

But in v8 you have to provide an `isInitiator` flag

```
const isInitiator = true | false
const stream = v8feed.replicate(isInitator)
```

`isInitiator` indicates whether we are currently acting as a passive or active peer, i.e. if we are the one requesting the feed from someone who has it, or the one being asked.

### Updated capability system

In Hypercore <=7 we've always had a capability system built in enforcing that the public key of the first shared Hypercore had to be prenegotiated.

At the same time, the protocol has always allowed replicating multiple Hypercores over the same stream, using the same encryption parameters.  This means that if you have key X, and you inject key Y into the stream, the recipient can receive both feeds even if they lack key Y. Originally, the thought was that you would only replicate related Hypercores over a single stream (ones being used in the same data structure, for example).

Recently, multiple use-cases have appeared where this turned into limitation, so v8 introduces an updated system that enforces that the keys for every Hypercore you share over a stream must be preshared.

The system works by taking advantage of the Noise handshake. After a successful handshake each side of the connection will end up with a cryptographically unique session, `(rx, tx)` where `rx` is a receive key and `tx` is a transmit key.

In short, when asking to replicate a Hypercore, even over an existing stream, a peer must now share the capability `hash(KNOWN_PREFIX + tx + hypercoreKey, rx)`. The only way to produce this capability is to know the Hypercore key. 

### New OPTIONS message

One final thing!

We're also introducing a new `OPTIONS` message to the protocol, which replaces the old `HANDSHAKE` message.

Whereas previously you had to declare connection options, like which extensions you support, when the stream was first initialized, `OPTIONS` makes these options dynamic. Now you can update them at any time.

## More to come

We are excited about this release and hope you are too!

It will form the foundation for all our upcoming releases in the Hyper* ecosystem.
Our Hyperdrive v10 work builds on Hypercore v8 and will be next on our release road map.

Fell free to reach out to me on Twitter at [@mafintosh](https://twitter.com/mafintosh) if you have questions or general feedback.
