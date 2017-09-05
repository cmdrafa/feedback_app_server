// Loading modules
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Loading conf file with the secrets
const keys = require('../config/keys');

// Loading the users model that was defined in ./models/user.js
// I can pull the model just because the model is already loaded in mongoose.
const User = mongoose.model('users');

// Setting cookie
// the (user) that is passed to this function, is the same that was retrieved
// in the passport.use function, the existing one or the new one that was just created
passport.serializeUser((user, done) => {
    done(null, user.id); //user.id is the mongodbId, not googleId
});

// Retrieving user and logging him off 
passport.deserializeUser((id, done) => {
    User.findById(id) // Retrieving user by the id
        .then((user) => {
            done(null, user);
        });
});

// Call GoogleStrategy from passport
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
    (acessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    // User exists, call done()
                    done(null, existingUser);
                } else {
                    // User does not exist, create the model, save, and once saved call done();
                    new User({ googleId: profile.id })
                        .save()
                        .then((user) => done(null, user));
                }
            });
    })
);
