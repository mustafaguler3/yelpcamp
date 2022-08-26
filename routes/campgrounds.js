const express = require("express")
const router = express.Router();
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground")
const Review = require("./models/review")
const { isLoggedIn, isAuthor } = require("../middleware")
const campgrounds = require("../controllers/campgrounds")

router.route("/")
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

router.route("/:id")
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isAuthor,isLoggedIn,catchAsync(campgrounds.deleteCampground))

router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))


module.exports = router