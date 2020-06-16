const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//ROUTES
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Root Toute
router.get('/', (req, res) => {
    res.render('landing');
});

//AUTH ROUTES
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Show the register form
router.get('/register', (req, res) => {
    res.render('register');
});

//Handle Signup logic
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to yelpcamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});

//Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//Handling login logic
router.post(
    '/login',
    //middleware
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
    }),
    (req, res) => {}
);

//Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('warning', 'Logged Out Successfully');
    res.redirect('/campgrounds');
});

module.exports = router;
