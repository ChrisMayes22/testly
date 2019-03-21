mongoose = require('mongoose');
const keys = require('../config/keys');

const MONGO_URI = process.env.NODE_ENV === 'production' ? keys.MONGO_URI : process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true }).catch(err => console.log(err));

module.exports = mongoose;