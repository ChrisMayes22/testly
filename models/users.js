const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
    quizObject: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    quizName: String,
    scores: [Number],
    timesAttempted: Number,
    missedQuestions: [[{ type: Schema.Types.ObjectId, ref: 'Quiz.questions' }]]
})

const userSchema = new Schema({ //Most user info comes from directly from google, so validation is minimal.
    googleId: {
        type: String,
        required: [true, 'A Google id is required to create a user.']
    },
    displayName: {
        type: String,
        required: [true, 'The user must have a username']
    },
    roles: [{ type: String }], //used to authorize user / grant user privileges. 
    completedQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    scoreReports: [reportSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;