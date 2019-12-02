# node-cache

A simple cache implementation in Node.js

## Motivation

I know: there are several good modules in npm world but sometimes we don't have enough flexibility in terms of customizations. In my case I invested more time trying to tweak an existing module than develop my own.

Cache data can be as easy as a collection in memory that holds our most used records for the whole life cycle of our web app. For sure, that approach does not scale if we our web app receives several hits or if we have a huge amount of records to load in memory.

There are cache at different levels such as web or persistence. This implementation will cache data at persistence layer.

Take this implementation as a starting point. Probably won't be the most optimized solution to resolve your problem. There's not magic, you will have to spend some time until you get good results in terms of performance.

Among others reasons you will cache because:

-   Reduce response time
-   Reduce stress of your database
-   Save money: less CPU, less memory, less instances, etc.

## Available commands

`npm install`
`npm test`
`npm start`

Open browser

`http://localhost:3000`
