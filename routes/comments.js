const express = require('express');
const router = express.Router({ mergeParams: true });
const middleware = require('../middleware');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

//COMMENTS ROUTE
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

//Comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Something Went Wrong');
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully Created Comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//Comments -- edit route
router.get(
    '/:comment_id/edit',
    middleware.checkCommentOwnership,
    (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground Not Found');
                res.redirect('back');
            } else {
                Comment.findById(req.params.comment_id, (err, foundComment) => {
                    if (err) {
                        res.redirect('back');
                    } else {
                        res.render('comments/edit', {
                            campground_id: req.params.id,
                            comment: foundComment,
                        });
                    }
                });
            }
        });
    }
);

//Comments -- Update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, updatedComment) => {
            if (err) {
                res.redirect('back');
            } else {
                req.flash('success', 'Comment Updated Successfully');
                res.redirect('/campgrounds/' + req.params.id);
            }
        }
    );
});

//Comments --Destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment Deleted Successfully');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;