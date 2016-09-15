const app = require('express')()
    , rateLimit = require('./../lib');

/* Requests to any URL matching this route's pattern will be blocked for three seconds */
app.get('/api/:id/votes', rateLimit({
    timeout: 3000,
    exactPath: false
}), (req, res) => {
    res.send('You didn\'t get blocked!');
});

/* Requests to the exact same URL will be blocked for three seconds.
However, a call to /api/1/clicks won'\t cause a subsequent call to /api/2/clicks to get blocked.
Additionally in this example, a script will run every ten seconds to free memory for timed out blocks. */
app.get('/api/:id/clicks', rateLimit({
    timeout: 3000,
    exactPath: true,
    cleanUpInterval: 10000
}), (req, res) => {
    res.send('You didn\'t get blocked!');
});

app.listen(3000);