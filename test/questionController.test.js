const Question = require('../models/questions');
const questionController = require('../controllers/question-controller');

beforeEach(async function(){
    try {
        const question = await Question.findOne({});
        if(question){
            await Question.collection.drop();
        }
    } catch (e) {
        console.log('Err clearing database:', e);
    }
})

describe('Test Setup', () => {
    test('test environment variables configured correctly', () => {
        expect(process.env.PORT).toBe('5000');
        expect(process.env.MONGO_URI).toBe('mongodb://127.0.0.1:27017/testly__TEST');
    });
});
describe('Question Controller RESTful operations', () => {
    describe('Question creation', () => {
        test('When questionController.createQuestion is passed a valid object, a new question is created', async () => {
            const question = {
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a : 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            }
            await questionController.create(question);
            const found = await Question.findOne({ qId: question.qId });
            expect(found.qId).toBe(question.qId);
        });
        test('When questionController.createQuestion is passed an empty object, it throws an error', async () => {
            const question = {}
            await expect(questionController.create(question)).rejects.toThrow();

        });
        test('When questionController.createQuestion is passed object w/ inappropriate imgPath, it throws an error', async () => {
            const question = {
                qId: 'question_id_99',
                imgPath: 'fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            }
            await expect(questionController.create(question)).rejects.toThrow();
        });
        test('When create method is passed an id, but that id already exists, the new id is not written to the database', async () => {
            const question = {
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            }
            await questionController.create(question);
            await questionController.create(question);
            const found = await Question.find({ qId: question.qId });
            expect(found.length).toBe(1);
        });
    });
    describe('Question deletion', () => {
        test('When questionController.delete is passed a valid id, the targetted user is deleted', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await question.delete(question._id);
            const found = await Question.findById(question._id);
            expect(found).toBe(null);
        });
    });
    describe('Question updates', () => {
        test('When questionController.changeImgPath is passed a valid id, old image is replaced w/ input', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await questionController.changeImgPath(question._id, '/public/questionFoo.png');
            const updated = await Question.findById(question._id);
            expect(updated.imgPath).toBe('/public/questionFoo.png');
        });
        test('When questionController.changeImgPath is not in public, method throws error', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await expect(questionController.changeImgPath(question._id, 'questionFoo.png')).rejects.toThrow();
        });
        test('When questionController.changeAnswers is passed a valid id, old answers replaced w/ input', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 4', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await questionController.changeAnswers(question._id, 
                { a: 'a. 1', b: 'b. 2', c: 'c. 3', d: 'd. 5', e: 'e. 6' });
            const updated = await Question.findById(question._id);
            expect(updated.answers).toMatchObject({ a: 'a. 1', b: 'b. 2', c: 'c. 3', d: 'd. 5', e: 'e. 6' });
        });
        test('When questionController.changeAnswers is passed a non-object, it throws an error', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 4', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await expect(questionController.changeAnswers('foo')).rejects.toThrow();
        });
        test('When questionController.changeCorrect is passed a valid id, old correctAnswer replaced w/ input', async () => {
            const question = new Question({
                qId: 'question_id_99',
                imgPath: '/public/fooQuestion.png',
                answers: { a: 'a. 2', b: 'b. 3', c: 'c. 4', d: 'd. 7', e: 'e. 5' },
                correctAnswer: 'b',
                text: 'foo-text'
            });
            await question.save();
            await questionController.changeCorrect(question._id, 'c');
            const updated = await Question.findById(question._id);
            expect(updated.correctAnswer).toBe('c');
        });
    })
})