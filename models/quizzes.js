const mongoose = require('mongoose');
const { Schema } = mongoose;


//TODO: Update user schema to include a dictionary of completed tests w/ scores and times.

const questionSchema = new Schema({
    quizId: {
        type: String,
        required: [true, 'Each question must have a question ID']
    },
    imgPath: {
        type: String,
        validate: [includesPublic, 'question image paths must be in the public directory']
    },
    answers: {
        type: Object,
        required: [true, 'Each question must have a set of possible answers'],
        validate: [hasEnoughKeys, 'Each question must have at least two answers']
    },
    correctAnswer: {
        type: String,
        required: [true, 'Each question must have a specified correct answer']
    },
    text: {
        type: String,
        required: [true, 'Each question must text']
    }
});

const Question = mongoose.model('questions', questionSchema);

module.exports = Question;