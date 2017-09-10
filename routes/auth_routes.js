const passport = require('passport');


module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google',
        {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
    (req, res) => { 
        console.log('Google authentication request');
        res.redirect('/surveys');
    });

    app.get('/api/logout', (req, res) => {
        console.log('Logout request');
        req.logout();
        res.redirect('/');
    });

    // Getting current user
    app.get('/api/current_user', (req, res) => {
        console.log('Get request for the current user');
        res.send(req.user);
    });

};