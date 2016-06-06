'use strict';

module.exports = function (app, passport) {
    var request = require('request'),
        tempToken = require('../config/auth.js').facebookAuth.tempToken,
        Activity = require('./models/activity.js');

    app.get('/profile', function (req, res) {
        if (req.user) {
            res.status(200).send({
                user: req.user
            });
        } else {
            res.status(400).send('No auth');
        }
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/albums', isLoggedIn, function (req, res) {
        request.get('https://graph.facebook.com/v2.6/' + req.user.facebook.id + '/albums?access_token=' + (tempToken || req.user.facebook.token), function (err, httpResponse, body) {
            if (err) {
                console.log(err);
            } else {
                var result = JSON.parse(body);
                if (result.error) {
                    res.status(400).send({message: result.error.message});
                } else {
                    res.status(200).send(result.data);
                }
            }
        });
    });

    app.get('/albums/:albumId/photos', isLoggedIn, function (req, res) {
        request.get('https://graph.facebook.com/v2.6/' + req.params.albumId + '/photos?fields=images,created_time,name&access_token=' + (tempToken || req.user.facebook.token), function (err, httpResponse, body) {
            if (err) {
                console.log(err);
            } else {
                var result = JSON.parse(body);
                if (result.error || err) {
                    res.status(400).send(result.error || err);
                } else {
                    res.status(200).send(result.data);
                }
            }
        });
    });

    app.get('/activity', isLoggedIn, function (req, res) {
        Activity.find({user: req.user.id}, function (err, activities) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(activities);
            }
        })
    });

    app.get('/activity/new', isLoggedIn, function (req, res) {
        if (req.query.event) {
            var activity = new Activity({
                event: req.query.event,
                user: req.user.id,
                created_at: new Date()
            });
            activity.save(function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(req.query.event);
                }
            });
        } else {
            res.status(400).send('Please set event');
        }
    });

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#!/albums',
            failureRedirect: '/'
        }));

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};
