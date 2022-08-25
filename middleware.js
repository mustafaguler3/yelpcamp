const { campgroundSchema } = require("./schemas")

module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated){
        req.flash("error","you must be signed in")
        return res.redirect("/login")
    }
    next()
}

module.exports.validateCampground = (req,res,next) => {
    const { err } = campgroundSchema.validate(req.body);
    if(err){
        const msg = err.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }else {
        next()
    }
}

module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    }else {
        next()
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}