const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: { //used to create / initially authenticate user. Comes from Google.
        type: String,
        required: [true, 'A Google id is required to create a user.']
    },
    username: {
        type: String,
        required: [true, 'The user must have a username']
    },
    roles: [{ //used to authorize user / grant user privileges. 
        type: String
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;