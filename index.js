// Required Module
const express = require('express');
// Required services
require('./services/passport');
// Binding express to 'app'
const app = express();
// Binding the routes to app
require('./routes/auth_routes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on', PORT);
});