'use strict';

const blockedMap = {};
const options = {
    timeout: 1000 * 60 * 30, // 30 minutes default,
    cleanUpInterval: 0 // no cleanup by default
};

module.exports = (opts) => {
    if (opts && opts.timeout) options.timeout = opts.timeout;
    if (opts && opts.cleanUpInterval) options.cleanUpInterval = opts.cleanUpInterval;

    // Clean up to avoid memory leaks...
    if (options.cleanUpInterval) setInterval(checkBlockedAll, options.cleanUpInterval);

    return {
        isBlocked: (key, ip) => {
            return checkBlocked(key, ip);
        },
        setBlocked: (key, ip) => {
            if (!blockedMap[ip]) blockedMap[ip] = {};
            blockedMap[ip][key] = new Date();
        }
    }
}

function checkBlocked(key, ip, now) {
    if (!now) now = new Date();
    let blocked = Boolean(blockedMap[ip] && blockedMap[ip][key] && (now - blockedMap[ip][key]) <= options.timeout);
    if (!blocked && blockedMap[ip] && blockedMap[ip][key]) {
        delete blockedMap[ip][key];
        if (!Object.keys(blockedMap[ip]).length) delete blockedMap[ip];
    }
    return blocked;
}

function checkBlockedAll() {
    let now = new Date();
    Object.keys(blockedMap).forEach((outerIndex) => {
        Object.keys(blockedMap[outerIndex]).forEach((innerIndex) => {
            checkBlocked(innerIndex, outerIndex, now);
        });
    });
}