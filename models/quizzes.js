const mongoose = require('mongoose');
const { Schema } = mongoose;

const includesPublic = str => str.includes('/public/');
const hasEnoughKeys = obj => Object.keys(obj).length > 1;
const arrIsNotEmpty = arr => arr.length > 0;
const isGreaterThanZero = num => num > 0;
const isValidAnswer = el => {
    if(el.match(/[a-z]/) && el.length === 1){
        return true;
    }
    return false;
}

// ^^^ validation functions

const questionSchema = new Schema({ // Potential data: How often do people miss, similar questions, relevant strategy
    questionId: {
        type: Number,
        trim: true,
        required: [true, 'Each question must have a question ID'],
        validate: [isGreaterThanZero, 'Each question must have an id (#) greater than 0.']
    },
    imgPath: {
        type: String,
        trim: true,
        validate: [includesPublic, 'question image paths must be in the public directory']
    },
    answers: {
        type: Object,
        required: [true, 'Each question must have a set of possible answers'],
        validate: [hasEnoughKeys, 'Each question must have at least two answers']
    },
    correctAnswer: {
        type: String,
        trim: true,
        required: [true, 'Each question must have a specified correct answer'],
        validate: [isValidAnswer, 'correct answers should be a single latin lowercase character, most likely a-e.']
    },
    text: {
        type: String,
        required: [true, 'Each question must contain text']
    }
});

const quizSchema = new Schema({
    quizName: {
        type: String,
        trim: true,
        required: [true, 'A quiz name is required.']
    },
    scoreScale: {
        type: Object
    },
    timer: {
        type: Number, // use minutes
        validate: [isGreaterThanZero, 'The timer must be set to more than 0 minutes.']
    },
    questions: {
        type: [questionSchema],
        validate: [arrIsNotEmpty, 'A quiz must have at least one question.']
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;