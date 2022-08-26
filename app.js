const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review")
const reviewSchema = require("./schemas")

const userRoutes = require("./routes/users")
const reviewRoutes = require("./routes/reviews")
const campgroundRouter = require("./routes/campgrounds");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",()=>{
    console.log("database connected")
})

app.use(methodOverride("_method"))
app.use(express.static("public"))

const sessionConfig ={
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000* 60 * 60 * 24 *7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success =  req.flash("success");
    res.locals.error = req.flash("error")
    next()
})

app.get("/fakeUser",async(req,res) => {
    const user = new User({email: "m@hotmail.com",username:"musti"})
    const newUser = await User.register(user,"chicken")
    res.send(newUser)
})

app.use("/review",reviewRoutes)
app.use("/users",userRoutes)
app.use("/campgrounds",campgroundRouter);

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.engine("ejs",ejsMate)

app.use(express.urlencoded({extended:true}))

app.get("/", (req,res) => {
    res.render("home")
})





// app.all("*",(req,res,next) => {
//     next(new ExpressError("Page Not Found"))
// })

// app.use((err,req,res,next) => {
//     const { statusCode = 500, message = "Something went wrong"} =err;
//     res.status(statusCode).render("error")
// })



app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync(async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id,{ $pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`campgrounds/${id}`)
}))




app.post("/campgrounds/:id/reviews",catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})