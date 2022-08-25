const express = require("express")
const router = express.Router();
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground")
const Review = require("./models/review")
const { isLoggedIn } = require("../middleware")



router.get("/",async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index",{campgrounds})
})

router.get("/new",isLoggedIn,async (req,res) => {
    res.render("campgrounds/new")
})

router.post("/",isLoggedIn,validateCampground,catchAsync(async (req,res,next) => {
        //if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400)
        
        const campground = new Campground(req.body.campground)
        campground.author = req.user_id;
        await campground.save();
        req.flash("success","successfully made a new campground")
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get("/:id",async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author")
    if(!campground){
        req.flash("error","cannot find that campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{ campground })
})

router.get("/:id/edit",async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash("error","cannot find that campground")
        return res.redirect("/campgrounds")
    }
    if(!campground.author.equals(req.user._id)){
        req.flash("error","you dont have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render("campgrounds/edit",{ campground })
})

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error","you dont have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("success","Successfully updated campground")
    res.redirect(`campgrounds/${campground._id}`)
}))

router.delete("/:id",isAuthor,async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

module.exports = router