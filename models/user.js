const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")
const passport = require("passport");
const { default: mongoose } = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",userSchema)