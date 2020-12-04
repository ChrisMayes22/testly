const User = require('../models/users');
const Quiz = require('../models/quizzes');
const userController = require('../controllers/user-controller');

/* SETUP: Ensure test db is torn down after each test */

afterEach(async function(){
    try{
        const user = await User.findOne({});
        if(user){
            await User.collection.drop();
        }
        const quiz = await Quiz.findOne({});
        if(quiz){
            await Quiz.collection.drop();
        }
    } catch (e) {
        console.log('Err clearing database:', e);
    }
})

/* SETUP: Declare mock tests, quizzes, and users */

const profile = { googleId: '12346@#@aa', 
    displayName: 'Fieuline Bard', 
    roles: [], 
}
const profileId = { id: '12346@#@aa', 
    displayName: 'Fieuline Bard', 
    roles: [], 
}
const user = new User(profile);
let question = {
    questionId: 1,
    imgPath: '/public/fooQuestion.png',
    answers: { a : 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
    correctAnswer: 'b',
    text: 'foo-text'
}
let quizTemplate = {
    quizName: 'foo-quiz-id-one',
    scoreScale: {
        english: ['A', 'B', 'C-', 'D', 'D', 'D', 'F', 'F'],
        math: ['A', 'A', 'A-', 'B', 'B', 'C', 'D', 'F']
    },
    timer: 100,
    questions: [question]
}
let question2 = {
    questionId: 2,
    imgPath: '/public/fooQuestion2.png',
    answers: { a : 'a. 22', b: 'b. 23', c: 'c. 24', d: 'd. 27', e: 'e. 25' },
    correctAnswer: 'b',
    text: 'foo-text2'
}
let quizTemplate2 = {
    quizName: 'foo-quiz-id-two',
    scoreScale: {
        english: ['A', 'B', 'C-', 'D', 'D', 'D', 'F', 'F'],
        math: ['A', 'A', 'A-', 'B', 'B', 'C', 'D', 'F']
    },
    timer: 100,
    questions: [question, question2]
}
const quiz = new Quiz(quizTemplate)
const quiz2 = new Quiz(quizTemplate2);

const report1 = {
    quizObject: quiz,
    quizName: '72F',
    score: 34,
    missedQuestions: [quiz.questions[0]]
}

const report2 = {
    quizObject: quiz,
    quizName: '72F',
    score: 34,
    missedQuestions: [quiz.questions[0]]
}
const report3 = {
    quizObject: quiz,
    quizName: '71G',
    score: 28,
    missedQuestions: [quiz2.questions[0], quiz2.questions[1]]
}

/* TEST SUITES */

// describe('Test Setup', () => {
//     test('test environment variables configured correctly', () => {
//         expect(process.env.PORT).toBe('5000');
//         expect(process.env.MONGO_URI).toBe('mongodb://127.0.0.1:27017/testly__TEST');
//     });
// });
describe('User CRUD operations', () => {
    describe('When userController.create is accessed', () => {
        test('Given a valid google profile, a new user is created', async () => {
            await userController.create(profileId);
            const found = await User.findOne({ googleId: profile.googleId });
            expect(found.displayName).toBe(profile.displayName);
        });
        test('Given the google profile already exists, the id is not duplicated on the database', async () => {
            await userController.create(profileId);
            await userController.create(profileId);
            const found = await User.find({ googleId: profile.googleId });
            expect(found.length).toBe(1);
        });
    });
    describe('When userController.delete is accessed', () => {
        test('Given a valid id, the targetted user is deleted', async () => {
            await user.save();
            await userController.delete(user._id);
            const found = await User.findById(user._id);
            expect(found).toBe(null);
        })
    })
    describe('User Updates', () => {
        test('When userController.makeUser is passed a valid id, target is given role: ["user"]', async () => {
            const user = new User(profile);
            await user.save();
            await userController.makeUser(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('user')).toBe(true);
        });
        test('When userController.demoteUser is passed a valid id, target\'s user role is removed', async () => {
            const user = new User({...profile, roles: ['user']});
            await user.save();
            await userController.demoteUser(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('user')).toBe(false);
        });
        test('When userController.makeCoach is passed a valid id, target is given role: ["coach"]', async () => {
            const user = new User({...profile, roles: ['user']});
            await user.save();
            await userController.makeCoach(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('coach')).toBe(true);
        });
        test('When userController.demoteCoach is passed a valid id, target\'s coach role is removed', async () => {
            const user = new User({...profile, roles: ['user', 'coach']});
            await user.save();
            await userController.demoteCoach(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('coach')).toBe(false);
        });
        test('When userController.makeAdmin is passed a valid id, target is given role: ["admin"]', async () => {
            const user = new User({...profile, roles: ['user','coach']});
            await user.save();
            await userController.makeAdmin(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('admin')).toBe(true);
        });
        test('When userController.demoteAdmin is passed a valid id, target\'s admin role is removed', async () => {
            const user = new User({...profile, roles: ['user', 'coach', 'admin']});
            await user.save();
            await userController.demoteAdmin(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('admin')).toBe(false);
        });
        test('When a redundant role is passed to userController methods, no change is made', async () => {
            const user = new User({ ...profile, roles: ['user','coach','admin']});
            await user.save();
            await userController.makeUser(user._id);
            await userController.makeCoach(user._id);
            await userController.makeAdmin(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.length).toBe(user.roles.length);
            expect(user.roles.reduce((acc, curr, i) => acc * (curr === promoted.roles[i]), true)).toBeTruthy();

            /* ^^^Last assertion checks if each index of user.roles matches corresponding index in promoted & vice versa */
        });
    });
});
describe('Score report management', () => {
    describe('When userController.addScoreReport is accessed', () => {
        test('Given valid inputs on a first-time test, a new score report is added', async () => {
            const user = new User({...profile, roles: ['user'] });
            await user.save();
            await userController.addReport(user._id, report1);
            const fetched = await User.findById(user._id);
            expect(fetched.scoreReports.length).toBe(1);
            expect(fetched.scoreReports[0].quizName).toBe(report1.quizName);
        });
        test('Given valid inputs on a second attempt on a test, the existing score report is updated', async () => {
            const user = new User({
                ...profile, 
                roles: ['user'],
                scoreReports: [{
                    quizObject: quiz,
                    quizName: '72F',
                    scores: [34],
                    timesAttempted: 1,
                    missedQuestions: [[quiz.questions[0]]]
                }]
            });
            await user.save();
            await userController.addReport(user._id, report2);
            const fetched = await User.findById(user._id);
            expect(fetched.scoreReports.length).toBe(1);
            expect(fetched.scoreReports[0].quizName).toBe(report1.quizName);
            expect(fetched.scoreReports[0].timesAttempted).toBe(2);
        });
        test('Given attempts on multiple tests, one report per test is added', async () => {
            const user = new User({
                ...profile, 
                roles: ['user'],
                scoreReports: [{
                    quizObject: quiz,
                    quizName: '72F',
                    scores: [34],
                    timesAttempted: 1,
                    missedQuestions: [[quiz.questions[0]]]
                }]
            });
            await user.save();
            await userController.addReport(user._id, report3);
            const fetched = await User.findById(user._id);
            expect(fetched.scoreReports.length).toBe(2);
            expect(fetched.scoreReports[0].quizName).toBe(user.scoreReports[0].quizName);
            expect(fetched.scoreReports[1].quizName).toBe(report3.quizName);
        })
    });
    describe('When userController.deleteReportByIndex is accessed', () => {
        test('Given valid inputs & test was attempted only once, the target score report is deleted', async () => {
            const user = new User({
                ...profile, 
                roles: ['user'],
                scoreReports: [{
                    quizObject: quiz,
                    quizName: '72F',
                    scores: [34],
                    timesAttempted: 1,
                    missedQuestions: [[quiz.questions[0]]]
                }]
            });
            await user.save();
            const fetch1 = await User.findById(user._id);
            await userController.deleteReportByIndex(user._id, fetch1.scoreReports[0]._id, 0);
            const fetch2 = await User.findById(user._id);
            expect(fetch2.scoreReports.length).toBe(0);
        });
        test('Given valid inputs & test was attempted multiple times, the target score report is updated', async () => {
            const user = new User({
                ...profile, 
                roles: ['user'],
                scoreReports: [{
                    quizObject: quiz2,
                    quizName: '72F',
                    scores: [30, 34],
                    timesAttempted: 2,
                    missedQuestions: [
                        [quiz2.questions[0]],
                        [quiz2.questions[1]]
                    ]
                }]
            });
            await user.save();
            const fetch1 = await User.findById(user._id);
            await userController.deleteReportByIndex(user._id, fetch1.scoreReports[0]._id, 0);
            const fetch2 = await User.findById(user._id);
            expect(fetch2.scoreReports.length).toBe(1);
            expect(fetch2.scoreReports[0].missedQuestions.length).toBe(1);
            expect(fetch2.scoreReports[0].scores[0]).toBe(34);

            const fetchQuestionOId = fetch2.scoreReports[0].missedQuestions[0][0]; 
                // References the object id of the first missed question in the fetched user.
            const originalQuestionOId = user.scoreReports[0].missedQuestions[1][0];
                // References the object id of the second missed question in the original user.

            expect(quiz2.questions.id(fetchQuestionOId).questionId)
                .toBe(quiz2.questions.id(originalQuestionOId).questionId);
                // Since deleteScoreReport deletes question @ index 1, 
                // old index 1 question should be new index 0 question.
            
        });
    });
});

