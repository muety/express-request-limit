'use strict';

const ipblockLib = require('./ipblock');
const options = {};

module.exports = (opts) => {
    setOptions(opts);

    const ipblock = ipblockLib({ timeout: options.timeout, cleanUpInterval: options.cleanUpInterval });
    const err = new Error(options.errMessage);
    err.statusCode = options.errStatusCode;

    return (req, res, next) => {
        let ip = req.headers['x-real-ip'] || req.header['x-forwarded-for'] || req.ip;
        let key = options.exactPath ? req.url : req.route.path;
        if (ipblock.isBlocked(key, ip)) return next(err);
        ipblock.setBlocked(key, ip);
        next();
    }
}

function setOptions(opts) {
    options.errMessage = opts.errMessage || 'Too many requests made to this route.';
    options.errStatusCode = opts.errStatusCode || 429;
    options.timeout = opts.timeout || 1000 * 60 * 3;
    options.exactPath = opts.hasOwnProperty('exactPath') ? opts.exactPath : true;
    options.cleanUpInterval = opts.cleanUpInterval || 0;
}
