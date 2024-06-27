# FAsset Indexer

This is an implementation for indexing the FAsset protocol smart contract operations. The FAsset smart contracts operate in a way that most of the state can be collected from emmited events. This repo consists of two workspaces:

1. FAsset Indexer Core: scrapes the chain (currently Coston) for events and stores them in a database, optimized for FAsset analytics.
1. FAsset Indexer Api: nestjs based API to query the indexed data.

The projects are separated, each having its own `.env` file. In both cases it needs to be configured with the sqlite database path.