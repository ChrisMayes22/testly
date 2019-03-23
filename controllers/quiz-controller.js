require('../db/mongoose');
const Quiz = require('../models/quizzes');
const keys = require('../config/keys');

module.exports = {
    async create(data) {
        const existingQuiz = await Quiz.findOne({ quizName: data.quizName });
        if(!existingQuiz) {
            const newQuiz = new Quiz(data);
            await newQuiz.save();
            return newQuiz._id;
        }
        return existingQuiz._id;
    },
    async delete(id) {
        await Quiz.findByIdAndDelete(id);
        return id;
    },
    async changeScale(id, newScale){
        if(typeof newScale !== 'object'){ // b/c mongoose update methods do not validate this
            throw new Error('input must be an object.');
        }
        await Quiz.findByIdAndUpdate(id, { $set: { scoreScale: newScale } });
        return id;
    },
    async changeTimer(id, newTimer){
        await Quiz.findByIdAndUpdate(id, { $set: { timer: newTimer } });
        return id;
    },
    async addQuestion(id, newQuestion){
        if(typeof newQuestion.questionId !== 'number'){
            throw new Error('The question id (its # in the quiz) must be a number.');
        }
        if(newQuestion.questionId <= 0){
            throw new Error('Each question must have an id (#) greater than 0.')
        }
        const quiz = await Quiz.findById(id);
        quiz.questions.splice(newQuestion.questionId -1, 0, newQuestion); // -1 b/c questionId is never 0
        quiz.questions.forEach((_, i) => {
            quiz.questions[i].questionId = i+1; // Ensures that there is exactly one question id per index
        });                                     // note - questionId is used to order questions when quiz is rendered.
        await quiz.save()
        return id;
    },
    async deleteQuestion(quizName, questionId){
        const quiz = await Quiz.findById(quizName);
        await quiz.questions.id(questionId).remove();

        quiz.questions.forEach((_, i) => {
            quiz.questions[i].questionId = i+1; //See previous comment
        });   

        await quiz.save();
        return quiz;
    },
    async updateImg(quizName, questionId, path){
        if(typeof path !== 'string'){
            throw new Error('new image path must be a string');
        }
        const quiz = await Quiz.findById(quizName);
        const question = quiz.questions.id(questionId);
        question.imgPath = path;
        await quiz.save();
        return quiz;
    },
    async updateAnswers(quizName, questionId, answers){
        if(typeof answers !== 'object'){
            throw new Error('answers must be organized inside an object');
        }
        const quiz = await Quiz.findById(quizName);
        const question = quiz.questions.id(questionId);
        question.answers = answers;
        await quiz.save();
        return quiz;
    },
    async updateCorrect(quizName, questionId, correct){
        const quiz = await Quiz.findById(quizName);
        const question = quiz.questions.id(questionId);
        question.correctAnswer = correct;
        await quiz.save();
        return quiz;
    },
    async updateText(quizName, questionId, text){
        const quiz = await Quiz.findById(quizName);
        const question = quiz.questions.id(questionId);
        question.text = text;
        await quiz.save();
        return quiz;
    }
}