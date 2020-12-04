const mongoose = require('mongoose');
const User = mongoose.model('User');
const express = require('express');
const router = new express.Router();


router.get('/logout', (req, res, next) => {
    console.log('logged out');
    req.logout();
    res.redirect('/');
})

router.get('/current_user', async (req, res, next) => {
    console.log('SESSION', req.session)
    if(!req.session.passport){
        res.send(false)
    } else {
        const currentUser = await User.findById(req.session.passport.user);
        res.send(currentUser);
    }
})

module.exports = router;