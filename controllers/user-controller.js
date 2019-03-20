require('../db/mongoose');
const User = require('../models/users');

module.exports = {
    async create(request, accessToken, refreshToken, profile) { //used in /services/passport.js 
        const existingUser = await User.findOne({ googleId: profile.id});
        if(!existingUser) {
            const newUser = new User({ googleId: profile.id, username: profile.displayName});
            await newUser.save();
        }
    },
    async delete(id) {
        await User.findByIdAndDelete(id);
    },
    async makeUser(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'user' }})
    },
    async demoteUser(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'user' }});
    },
    async makeCoach(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'coach' }})
    },
    async demoteCoach(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'coach' }});
    },
    async makeAdmin(id){
        await User.findByIdAndUpdate(id, { $addToSet: { roles: 'admin' }})
    },
    async demoteAdmin(id){
        await User.findByIdAndUpdate(id, { $pull: { roles: 'admin' }});
    }
}