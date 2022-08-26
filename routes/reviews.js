const express = require("express")
const router = express.Router({mergeParams: true})
const { validateReview ,isLoggedIn, isReviewAuthor } = require("../middleware")
const catchAsync = require("../utils/catchAsync")
const review = require("../controllers/reviews")

router.post("/",isLoggedIn,validateReview,catchAsync(review.createReview))

router.delete("/:reviewId",catchAsync(review.deleteReview))

module.exports = router