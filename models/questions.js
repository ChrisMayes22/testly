const mongoose = require('mongoose');
const { Schema } = mongoose;

const includesPublic = value => value.includes('/public/');

const questionSchema = new Schema({
    qId: {
        type: String,
        required: [true, 'Each question must have a question ID']
    },
    imgPath: {
        type: String,
        required: [true, 'Each question must have an image to display the question.'],
        validate: [includesPublic, 'question image paths must be in the public directory']
    },
    answers: {
        type: Object,
        required: [true, 'Each question must have a set of possible answers']
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