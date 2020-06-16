const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

//INDEX -- Show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

//CREATE -- Add new campgrounds to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author,
    };
    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Successfully Created Campground');
            res.redirect('/campgrounds');
        }
    });
});

//NEW -- Show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//SHOW -- Shows info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash('error', 'Campground Not Found');
                res.redirect('/campgrounds');
            } else {
                console.log(foundCampground);
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

//EDIT -- Show a pre-filled form to edit the existing campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    //Is user logged in???
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//UPDATE -- Update the existing campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                req.flash('success', 'Campground Updated Successfully');
                res.redirect('/campgrounds/' + req.params.id);
            }
        }
    );
});

//DESTROY -- Delete the existing campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground Deleted Successfully');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
