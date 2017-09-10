// Required Modules
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');


// Required services, confs and models
require('./models/user'); // Gotta load it first because passport service gotta know about its existence beforehand
require('./services/passport');
const keys = require('./config/keys');

// Fixing the mongoose deprecation warning
mongoose.Promise = global.Promise;

// Connect to mongodb
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
});

// Binding express to 'app'
const app = express();

// Tell express/passport to use cookies in the session and bodyParser middleware
app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: (30 * 24 * 60 * 60 * 1000), //Cookie expiration time
        keys: [keys.cookieKey] // Secret key for encrypting(hashing) the cookie
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Binding the routes to express_app
require('./routes/auth_routes')(app);
require('./routes/billing_routes')(app);

// Define PORT and open the node server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Authentication/Billing emaily-server running on port', PORT);
});