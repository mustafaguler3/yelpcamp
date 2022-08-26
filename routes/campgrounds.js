const express = require("express")
const router = express.Router();
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground")
const Review = require("./models/review")
const { isLoggedIn, isAuthor } = require("../middleware")
const campgrounds = require("../controllers/campgrounds")

router.get("/",catchAsync(campgrounds.index))

router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.post("/",isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

router.get("/:id",catchAsync(campgrounds.showCampground))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))

router.delete("/:id",isAuthor,isLoggedIn,catchAsync(campgrounds.deleteCampground))

module.exports = router