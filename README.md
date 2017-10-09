## Nexosis API Client Library

This software is provided as a way to include Nexosis API functionality in your own JavaScript software.

### Usage

Add the library to your project by installing from NPM.

``` bash
yarn add nexosis-api-client
```

Creating a new `NexosisClient` with an API key allows you to make calls to the API.  Each property of the client allows you to interact with a different part of the API.

``` js
const NexosisClient = require('nexosis-api-client').default
const client = new NexosisClient({ key: nexosisApiKey });

client.DataSets.list().then(dataSets => Console.log(dataSets.items));
client.Sessions.list().then(sessions => Console.log(sessions.items));
```

Each request returns a Promise, with the body of the response.

### More Information

You can read about the Nexosis API at [http://docs.nexosis.com/](http://docs.nexosis.com/)

Refer to the detailed API documentation at [https://developers.nexosis.com](https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af)

*Pull requests are welcome*

[![Build Status](https://travis-ci.org/Nexosis/nexosisclient-js.svg?branch=master)](https://travis-ci.org/Nexosis/nexosisclient-js)
