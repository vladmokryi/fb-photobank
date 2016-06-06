'use strict';

module.exports = {
    'facebookAuth': {
        'clientID': process.env.FB_CLIENTID,
        'clientSecret': process.env.FB_CLIENTSECRET,
        'callbackURL': process.env.FB_CALBACKURL,
        'tempToken': process.env.FB_TEMPTOKEN
    }
};