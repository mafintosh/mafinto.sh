([Chinese version available here](https://gist.github.com/jiangplus/bfebc5b2654226c6893ce11765346bbf), courtesy of [@jiangplus](https://github.com/jiangplus)

(This is an English translation of my Danish blog post, [Bitcoin for voksne](https://gist.github.com/mafintosh/435da6e64a0e15d05fa1f330e0886d4d))

Bitcoin is a digital currency that has no central authority. It's a currency where you do not have to rely on anyone to know it's worth it. As a concept, it's similar to gold. Gold has a value in itself, as opposed to, say a $100 note that only has value if the U.S. government says it has value. Similarly, the idea of ​​Bitcoins is that they have value by themselves.

Let's try to understand how Bitcoin works.

Bitcoin is more or less a major worldwide computer network that is constantly working to agree on a list of transactions.

A transaction is, for example, "Mathias transferred 100 bitcoins to Martin", just like a regular bank works internally.

In terms of Bitcoin, a transaction is called a "block" and a list of transactions is called a "chain" - a blockchain.

It is important to understand that this list of transactions, or blockchain, is completely public and anyone can read it and see what money is being transferred to each other. Bitcoin is a *very* public currency for the same reason - otherwise you can not confirm that the list of transactions ultimately is correct!

In fact, you do not write "Mathias" or "Martin" in the transaction. If you did, it would be hard to find out if "Mathias" had actually transferred the money, or if somebody just pretended to be "Mathias".

Instead, you use something called a cryptographic key.

## Cryptographic keys

A cryptographic key consists of two things.

A *secret key* that is a very, very large random number that is practically impossible to guess and you have to keep very secret.

A *public key* that is a large number as well.

Using cryptography, we can create a system where you can use a secret key to sign a transaction so that another person can use the public key to confirm that it was you and only you who signed it.

In terms of Bitcoin, these keys are called a wallet, because they are the ones you need to access your Bitcoins.

So when making a transction, what you actually do is write, "Public key `A` transferred 100 bitcoins to Public Key `B`" and use the secret key related to `A` to sign the transaction. That way no one can cheat transferring someone elses money.

## Blockchain

Now that we have  list of transactions it is of course important that everyone agrees on what the list looks like. Otherwise situations could occur where someone tries to cheat by transferring the same 100 bitcoins to more than one person! That wouldn't work very well.

Therefore, it is important that it isn't free to add new transactions to the list. If it were, it would be easy to try to cheat by sending *a lot* of conflicting transactions at the same time.

In this context, not free does not mean that it will cost you money (as in $) directly. Remember, we are trying to create a new currency where we do not trust anyone.

## Proof of work

Instead of it costing $ to put a new transaction in the list, it costs work instead. This may sound a bit abstract, and that is because it is. Time is money and work takes time.

Now remember it is a computer network we are working with and therefore work means that your computer should try to calculate some difficult things that take time to perform.

The computers that perform the work are called miners. The reason they are called miners is that they are rewarded for their work in the form of being awarded some Bitcoins (digital gold). It's important to have an incentive to do the work to add a new transaction to the list, otherwise nobody will do it.

It is also important to prove that work was done and that a miner isn't just pretending to have done it. Therefore, we call it a "Proof of Work".

The work on which Bitcoin is based is a technique called "hashing", and no not the kind of hashing that takes place at Freetown Christiania.

## Hashing

Hashing is a mathematical and computer science technique where a machine inputs a very large number and outputs a much smaller number.

```
hashing(very large number) -> much smaller number 
```

The same large number always gives the same much smaller number and it is practically impossible to guess the large number that was input if you know the outputted small number.

We can use hashing to make a "proof of work".

It works very simple. I choose two numbers, for example, `1,000,000` and `42`, and then I ask you to find a very large number where

```
hashing(very large number + 42) < 1,000,000 
```

The only way you can find a number where this is true is to try a whole lot of numbers! There is no shortcut. That's how I know you had to work to find it. The really smart thing is that if I instead of `1,000,000` had said `500,000` then I know you have to work twice as much on average, because the output range is about half the size.

Therefore we have a way to make a "proof of work".

## Digging for digital gold

When we have a new transaction we would like to make, we do it this way.

1. We make a new transaction using our secret and public key.
2. We look at the current list of transactions, add all the numbers together in the list and add them to the numbers in our transaction. We call this number a "challenge".
3. We publish our transaction and challenge on the network.
4. When another computer (miner) has performed work where `hashing(very large number + challenge) < 1,000,000`, the transaction is added to the list and the miner is a awarded some Bitcoins.

It's by digging for digital gold this way that new Bitcoins are added to the network and money can be transferred to each other.

In fact, the amount of Bitcoins that will be awarded to a miner decreases over time, and `1,000,000` is adjusted depending on how many computers are on the network.

Both things are used create an incentive to mine for Bitcoins. It gets harder and harder to find them, just like gold, and even if you buy a lot of computers it will not be easier either (`1,000,000` will be smaller and you need to do more work).

It's for the same reason you read about the excessive energy consumption of Bitcoins in the media. It is built into the system to create incentives for mining them! In the original paper describing Bitcoins, it is assumed that power comes 100% from renewable sources for the same reason - otherwise the energy requirement will be very costly.

There is also a constraint on how many transactions can be done every 10 minutes, in practice 6.6 transactions per second. This constraint was added to avoid a lot of people adding a bunch of useless data, filling up the list. Therefore, it becomes more expensive and takes longer if many people want to transfer Bitcoins at the same time.

In recent times there has been a boom in Bitcoin interest and activity. Today, the cost of a Bitcoin transaction is around $20, which is high fee if you wanted to say, buy a computer game worth $50 with Bitcoins, and is a part of why some people are concerned that Bitcoin could work as an actual everyday currency at present.
