require('../db/mongoose');
const Question = require('../models/questions');

module.exports = {
    async create(data) { //used in /services/passport.js 
        const existingQuestion = await Question.findOne({ questionId: data.questionId });
        if(!existingQuestion) {
            const newQuestion = new Question(data);
            await newQuestion.save();
        }
    },
    async delete(id) {
        await Question.findByIdAndDelete(id);
    },
    async changeImgPath(id, imgPath){
        if(!imgPath.includes('/public/')){ // Included b/c mongoose update methods can't validate
            throw new Error('question image must be in public directory');
        }
        await Question.findByIdAndUpdate(id, { $set: { imgPath }})
    },
    async changeAnswers(id, answers){
        if(typeof answers !== 'object'){
            throw new Error('invalid answers type: should be object');
        }
        if(Object.keys(answers).length < 2){
            throw new Error('invalid answers: must be at least 3 answers.')
        }
        await Question.findByIdAndUpdate(id, { $set: { answers }})
    },
    async changeCorrect(id, correctAnswer){
        await Question.findByIdAndUpdate(id, { $set: { correctAnswer }})
    }
}