require('../db/mongoose');
const User = require('../models/users');
const keys = require('../config/keys');

module.exports = {
    async create(request, accessToken, refreshToken, profile, done) { //used in /services/passport.js 
        const existingUser = await User.findOne({ googleId: profile.id });
        if(!existingUser) {
            const newUser = new User({ 
                googleId: profile.id, 
                displayName: profile.displayName,
                roles: ['user']
            });
            keys.COACH_IDS.forEach(char => {
                if(char === profile.id){
                    newUser.roles.push('coach')
                }
            });
            keys.ADMIN_IDS.forEach(char => {
                if(char === profile.id){
                    newUser.roles.push('admin');
                }
            });
            await newUser.save();
            done(null, newUser);
        }
        done(null, existingUser);
    },
    async delete(id) {
        await User.findByIdAndDelete(id);
    },
    async makeUser(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'user' }});
    },
    async demoteUser(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'user' }});
    },
    async makeCoach(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'coach' }});
    },
    async demoteCoach(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'coach' }});
    },
    async makeAdmin(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'admin' }});
    },
    async demoteAdmin(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'admin' }});
    },
    async addReport(userId, report){
        const user = await User.findById(userId);
        const quiz = user.scoreReports.find(quiz => quiz.quizName === report.quizName);
        if(!quiz){
            report.scores = [report.score];
            delete report.score;
            report.timesAttempted = 1;
            const wrongAnswersArr = [];
            wrongAnswersArr.push(report.missedQuestions);
            report.missedQuestions = wrongAnswersArr;
            user.scoreReports.push(report);
            await user.save();
            return user;
        }
        quiz.scores.push(report.score);
        quiz.timesAttempted++;
        quiz.missedQuestions.push(report.missedQuestions);
        const index = user.scoreReports.findIndex(quiz => quiz.quizName === report.quizName);
        user.scoreReports[index] = quiz;
        await user.save();
        return user;
    },
    async deleteReportByIndex(userId, reportId, index){
        const user = await User.findById(userId);
        const report = user.scoreReports.id(reportId);
        if(report.timesAttempted === 1){
            report.remove();
            await user.save();
            return user;
        }
        report.scores.splice(index, 1);
        report.timesAttempted--;
        report.missedQuestions.splice(index, 1);
        const insertIndex = user.scoreReports.findIndex(quiz => quiz.quizName === report.quizName);
        user.scoreReports[insertIndex] = report;
        await user.save();
        return user;
    }
}