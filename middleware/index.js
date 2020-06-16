// All middleware goes here
const express = require('express');
const app = express();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('/campgrounds');
            } else {
                //Does user own the campground???
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', `You Don't Have Permission To Do That`);
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You Need To Be Logged In To Do That');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('/campgrounds');
            } else {
                //Does user own the comment???
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', `You Don't Have Permission To Do That`);
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You Need To Be Logged In To Do That');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'You Need To Be Logged In To Do That');
    res.redirect('/login');
}

module.exports = middlewareObj;
