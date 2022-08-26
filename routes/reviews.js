const express = require("express")
const router = express.Router({mergeParams: true})
const { validateReview ,isLoggedIn, isReviewAuthor } = require("../middleware")
const Campground = require("../models/campground")
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError")
const catchAsync = require("../utils/catchAsync")
const review = require("../controllers/reviews")

router.post("/",isLoggedIn,validateReview,catchAsync(review.createReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports = router