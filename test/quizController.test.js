const Quiz = require('../models/quizzes');
const quizController = require('../controllers/quiz-controller');

let question1 = {
    questionId: 1,
    imgPath: '/public/fooQuestion.png',
    answers: { a : 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
    correctAnswer: 'b',
    text: 'foo-text'
}
let question2 = {
    questionId: 2,
    imgPath: '/public/fooQuestionss.png',
    answers: { a : 'a. 1', b: 'b. 2', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
    correctAnswer: 'a',
    text: 'foo-text2'
}
let quiz = {
    quizName: 'foo-quiz-id-one',
    scoreScale: {
        english: ['A', 'B', 'C-', 'D', 'D', 'D', 'F', 'F'],
        math: ['A', 'A', 'A-', 'B', 'B', 'C', 'D', 'F']
    },
    timer: 100,
    questions: [question1, question2]
}


afterEach(async function(){
    try {
        const quiz = await Quiz.findOne({});
        if(quiz){
            await Quiz.collection.drop();
        }
    } catch (e) {
        console.log('Err clearing QUIZ collection:', e);
    }
})

describe('Test Setup', () => {
    test('test environment variables configured correctly', () => {
        expect(process.env.PORT).toBe('5000');
        expect(process.env.MONGO_URI).toBe('mongodb://127.0.0.1:27017/testly__TEST');
    });
});
describe('Question Controller RESTful operations', () => {
    describe('When quizController.create is accessed', () => {
        test('Given valid input and coach auth is passed, a new question is created', async () => {
            await quizController.create(quiz);
            const found = await Quiz.findOne({ quizName: quiz.quizName });
            expect(found.quizName).toBe(quiz.quizName);
        });
        test('Given template has no questions, method throws an error.', async () => {
            const invalidQuiz = { ...quiz, questions: [] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template has no quizName, method throws an error.', async () => {
            const invalidQuiz = { ...quiz, quizName: undefined };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question has no text, method throws an error.', async () => {
            const invalidQuestion = { ...question1, text: undefined };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question has no questionId, method throws an error.', async () => {
            const invalidQuestion = { ...question1, questionId: undefined };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question has questionId <= 0, method throws an error.', async () => {
            const invalidQuestion = { ...question1, questionId: 0 };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question has fewer than 2 answers, method throws an error.', async () => {
            const invalidQuestion = { ...question1, answers: { a: 'a. 1' } };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question image not in the public directory, method throws an error.', async () => {
            const invalidQuestion = { ...question1, imgPath: 'invalid-path/invalid_path' };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
        test('Given template question does not have a correct answer, method throws an error.', async () => {
            const invalidQuestion = { ...question1, correctAnswer: undefined };
            const invalidQuiz = { ...quiz, questions: [invalidQuestion] };
            await expect(quizController.create(invalidQuiz)).rejects.toThrow();
        });
    });
    describe('When quizController.delete is accessed', () => {
        test('Given a valid id is passed, the targetted quiz is deleted', async () => {
            const createdQuestion = new Quiz(quiz);
            await createdQuestion.save();
            await quizController.delete(createdQuestion._id);
            const found = await Quiz.findById(createdQuestion._id);
            await expect(found).toBe(null);
        });
    });
    describe('When quizController update-type methods are accessed', () => {
        describe('When quizController.changeScale is accessed', () => {
            test('Given valid input, quiz.scoreScale is updated', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                const newScale = {
                    english: ['A', 'A', 'B', 'C', 'C', 'D', 'D', 'F'],
                    math: ['A', 'A', 'B', 'C', 'C', 'D', 'D', 'F']
                }
                await quizController.changeScale(newQuiz._id, newScale);
                const updated = await Quiz.findById(newQuiz.id);
                expect(updated.scoreScale).toMatchObject(newScale)
            });
            test('Given input is not an object, method throws an error', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                const newScale = 'foo';
                await expect(quizController.changeScale(newQuiz._id, newScale)).rejects.toThrow();
            });
        });
        describe('When quizController.changeTimer is accessed', () => {
            test('Given valid input, quiz.timer is updated', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                const newTimer = 120;
                await quizController.changeTimer(newQuiz._id, newTimer);
                const updated = await Quiz.findById(newQuiz.id);
                expect(updated.timer).toBe(newTimer);
            });
            test('Given input it not a number, methods throws error', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                await expect(quizController.changeTimer(newQuiz._id, 'foo')).rejects.toThrow();
            });
        });
        describe('When quizController.changeTimer is accessed', () => {
            test('Given valid input, quiz.timer is updated', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                const newTimer = 120;
                await quizController.changeTimer(newQuiz._id, newTimer);
                const updated = await Quiz.findById(newQuiz.id);
                expect(updated.timer).toBe(newTimer);
            });
            test('Given input it not a number, methods throws error', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                await expect(quizController.changeTimer(newQuiz._id, 'foo')).rejects.toThrow();
            });
        });
        describe('When quizController.addQuestion is accessed', () => {
            test('Given valid input, is added to quiz.questions', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                await quizController.addQuestion(newQuiz._id, question2);
            });
            test('Given question added, is inserted @ index === question.id, & questions are sorted correctly', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                const question3 = {
                    questionId: 2,
                    imgPath: '/public/fooQuestionss.jpg',
                    answers: { a : 'a. 6', b: 'b. 1', c: 'c. 3', d: 'd. 7', e: 'e. 5' },
                    correctAnswer: 'b',
                    text: 'foo-textzoz'
                };
                await quizController.addQuestion(newQuiz._id, question3);
                const updated = await Quiz.findById(newQuiz._id);
                for(i = 0; i < updated.questions.length; i++ ){
                    expect(updated.questions[i].questionId).toBe(i+1);
                };
                expect(updated.questions[1].text).toBe(question3.text);
            });
            test('Given questionId is less than 1, method throws err', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, questionId: 0 };
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
            test('Given questionId is not a number, method throws err', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, questionId: 'foo' };
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
            test('Given question has no text, method throws an error.', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, text: undefined };
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
            test('Given question answers has fewer than 2 answers, method throws an error.', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, answers: { a: 'a. 1' }};
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
            test('Given imgPath is not in the public directory, method throws an error.', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, imgPath: 'invalid-address/invalid_address'};
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
            test('Given correctAnswer is not defined, method throws an error.', async () => {
                const newQuiz = new Quiz({...quiz, questions: [question1]});
                await newQuiz.save();
                const questionTwo = {...question2, correctAnswer: undefined };
                await expect(quizController.addQuestion(newQuiz._id, questionTwo)).rejects.toThrow();
            });
        });
        describe('When quizController.deleteQuestion is accessed', () => {
            test('Given valid input, question is deleted', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                await quizController.deleteQuestion(newQuiz._id, newQuiz.questions[0]._id);
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0]._id).toEqual(newQuiz.questions[1]._id);
            });
            test('Given a question is deleted, remaining questionIds sort appropriately', async () => {
                const newQuiz = new Quiz(quiz)
                await newQuiz.save();
                await quizController.deleteQuestion(newQuiz._id, newQuiz.questions[0]._id);
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0].questionId).toBe(1);
            });
        });
    });
    describe('When question update-type methods are accessed', () => {
        describe('When quizController.updateImg is accessed', () => {
            test('Given valid input, target question image is updated', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await quizController.updateImg(newQuiz._id, newQuiz.questions[0]._id, '/public/updated_img_path');
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0].imgPath).toBe('/public/updated_img_path');
            });
            test('Given path is not a string, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await expect(quizController
                    .updateImg(newQuiz._id, newQuiz.questions[0]._id, undefined ))
                    .rejects.toThrow();
            });
            test('Given path is not in a public directory, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await expect(quizController
                    .updateImg(newQuiz._id, newQuiz.questions[0]._id, 'invalid-path/invalid_path'))
                    .rejects.toThrow();
            });
        });
        describe('When quizController.updateAnswers is accessed', () => {
            test('Given valid input, target question answers are updated', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                const newAnswers = { a: 'a. 7', b: 'b. 3' }
                await quizController.updateAnswers(newQuiz._id, newQuiz.questions[0]._id, newAnswers);
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0].answers).toMatchObject(newAnswers);
            });
            test('Given answers is not an object, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await expect(quizController
                    .updateAnswers(newQuiz._id, newQuiz.questions[0]._id, undefined))
                    .rejects.toThrow();
                await expect(quizController
                    .updateAnswers(newQuiz._id, newQuiz.questions[0].id, 'foo'))
                    .rejects.toThrow();
            });
            test('Given answers has fewer than 2 values, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                const answers = { a: 'a. 1' };
                await expect(quizController
                    .updateAnswers(newQuiz._id, newQuiz.questions[0]._id, answers))
                    .rejects.toThrow();
            });
        });
        describe('When quizController.updateCorrect is accessed', () => {
            test('Given valid input, target question\'s correctAnswer value is updated', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await quizController.updateCorrect(newQuiz._id, newQuiz.questions[0]._id, 'b');
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0].correctAnswer).toBe('b');
            });
            test('Given correct is not a valid answer, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await expect(quizController
                    .updateCorrect(newQuiz._id, newQuiz.questions[0]._id, '3'))
                    .rejects.toThrow();
                await expect(quizController
                    .updateCorrect(newQuiz._id, newQuiz.questions[0]._id, undefined))
                    .rejects.toThrow();
            });
        });
        describe('When quizController.updateText is accessed', () => {
            test('Given valid input, target question\'s text is updated', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await quizController.updateText(newQuiz._id, newQuiz.questions[0]._id, 'foo text');
                const updated = await Quiz.findById(newQuiz._id);
                expect(updated.questions[0].text).toBe('foo text');
            });
            test('Given text is not a string, method throws an error', async () => {
                const newQuiz = new Quiz(quiz);
                await newQuiz.save();
                await expect(quizController
                    .updateText(newQuiz._id, newQuiz.questions[0]._id, undefined))
                    .rejects.toThrow();
                await expect(quizController
                    .updateText(newQuiz._id, newQuiz.questions[0]._id, {}))
                    .rejects.toThrow();
            });
        });
    });
});