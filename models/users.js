const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: { //used to create / initially authenticate user. Comes from Google.
        type: String,
        required: [true, 'An id is required to create a user.']
    },
    role: { //used to authorize user / grant user privileges. 
        type: String,
        required: [true, 'The user must be assigned an authorization level']
    }
});

mongoose.model('users', userSchema);