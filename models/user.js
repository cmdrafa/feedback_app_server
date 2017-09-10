const mongoose = require('mongoose');
const { Schema } = mongoose; // === to const Schema = mongoose.Schema

const userSchema = new Schema({
    googleId: String,
    credits: {
        type: Number,
        default: 0
    },
    displayName: String
});

mongoose.model('users', userSchema);
