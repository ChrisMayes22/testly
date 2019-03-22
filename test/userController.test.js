const app = require('../server');
const User = require('../models/users');
const userController = require('../controllers/user-controller');

afterEach(async function(){
    try{
        const user = await User.findOne({});
        if(user){
            await User.collection.drop();
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
describe('User Controller RESTful operations', () => {
    describe('User creation', () => {
        test('When userController.create is passed a valid google profile, a new user is created', async () => {
            const profile = {
                id: 'fooid333',
                displayName: 'fooName nameFoo',
            }
            await userController.create(null, null, null, profile);
            const found = await User.findOne({ googleId: profile.id });
            expect(found.username).toBe(profile.displayName);
        });
        test('When create method is passed an id, but that id already exists, the new id is not written to the database', async () => {
            const profile = {
                id: 'fooid333',
                displayName: 'fooName nameFoo',
            }
            await userController.create(null, null, null, profile);
            await userController.create(null, null, null, profile);
            const found = await User.find({ googleId: profile.id });
            expect(found.length).toBe(1);
        });
    })
    describe('User deletion', () => {
        test('When userController.delete is passed a valid id, the targetted user is deleted', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['coach']});
            await user.save();
            await userController.delete(user._id);
            const found = await User.findById(user._id);
            expect(found).toBe(null);
        })
    })
    describe('User Updates', () => {
        test('When userController.makeUser is passed a valid id, target is given role: ["user"]', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: []});
            await user.save();
            await userController.makeUser(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('user')).toBe(true);
        });
        test('When userController.demoteUser is passed a valid id, target\'s user role is removed', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user']});
            await user.save();
            await userController.demoteUser(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('user')).toBe(false);
        });
        test('When userController.makeCoach is passed a valid id, target is given role: ["coach"]', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user']});
            await user.save();
            await userController.makeCoach(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('coach')).toBe(true);
        });
        test('When userController.demoteCoach is passed a valid id, target\'s coach role is removed', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user', 'coach']});
            await user.save();
            await userController.demoteCoach(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('coach')).toBe(false);
        });
        test('When userController.makeAdmin is passed a valid id, target is given role: ["admin"]', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user','coach']});
            await user.save();
            await userController.makeAdmin(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.includes('admin')).toBe(true);
        });
        test('When userController.demoteAdmin is passed a valid id, target\'s admin role is removed', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user', 'coach', 'admin']});
            await user.save();
            await userController.demoteAdmin(user._id);
            const demoted = await User.findById(user._id);
            expect(demoted.roles.includes('admin')).toBe(false);
        });
        test('When a redundant role is passed to userController methods, no change is made', async () => {
            const user = new User({ googleId: '12346@#@aa', username: 'Fieuline Bard', roles: ['user','coach','admin']});
            await user.save();
            await userController.makeUser(user._id);
            await userController.makeCoach(user._id);
            await userController.makeAdmin(user._id);
            const promoted = await User.findById(user._id);
            expect(promoted.roles.length).toBe(user.roles.length);
            expect(user.roles.reduce((acc, curr, i) => acc * (curr === promoted.roles[i]), true)).toBeTruthy();

            /* ^^^Last assertion checks if each index of user.roles matches corresponding index in promoted & vice versa */
        })
    })
})

