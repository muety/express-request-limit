# express-request-limit
Simple, in-memory rate-limiting middleware for Express. When injected to Express routes, it will block requests from an IP address, that arrive in too short intervals. 

Also works, if your application runs behind a proxy. If present, the `X-Real-Ip` or `X-Forwarded-For` header will be used to determine client ip address.

[![NPM](https://nodei.co/npm/express-request-limit.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/express-request-limit/)

## Installation
`$ npm install --save express-request-limit`

## Usage example
```javascript
const app = require('express')()
    , rateLimit = require('express-request-limit');

const rateLimitOpts = {
    timeout: 1000 * 60 * 30,
    exactPath: true,
    cleanUpInterval: 0,
    errStatusCode: 429,
    errMessage: 'Too many requests made to this route.'
}

app.get('/api/:id/votes', rateLimit(rateLimitOpts), (req, res) => {
    res.send('You didn\'t get blocked!');
});

app.listen(3000);
```

## Options
The middleware get initialized with an (optional) object containing some configuration parameters. Available parameters are:

 * **timeout** (optional): Time in milliseconds for new requests to get blocked. For instance, if set to `1000`, requests will be blocked within a frame of one second after an initial request had arrived. Default to `1,800,000` (30 minutes).
 * **cleanUpInterval** (optional): Blocked IPs and their respective routes / URLs are stored in a map internally. By default, a map entry gets cleared when a new request from the blocked IP arrives at the blocked route after the block timeout is over. But if a client never performs a second request, the entry will remain in the map. Use this property to specify an interval in milliseconds, at which a script will run through the map and clear timed out blocks to free memory. However, if run too frequently, this may influence performance. Default to `false` (no clean up). 
 * **errStatusCode** (optional): The HTTP status code to be set for the response to a blocked request. Defaults to `429` ("Too many requests").
 * **errMessage** (optional): The message to be sent alongside the response to a blocked request. Default to `'Too many requests made to this route.'`.
 * **exactPath** (optional): Set whether the exact request URL or the called endpoint's route will be used for blocking. If set to `true`, for instance, a request to `/api/1/votes`, mapped to the route definition with pattern `/api/:id/votes` won't cause a subsequent request to `/api/2/votes` to get blocked. Only requests to the exact same URL match will be blocked. If set to `false`, all requests mapped to the route, which the middleware is applied to, will be blocked. Defaults to `true`.

## Todo
 * Add tests
 
## License
MIT @ [Ferdinand Mütsch](https://ferdinand-muetsch.de)
