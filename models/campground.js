const mongoose = require("mongoose")
const Schema = mongoose.Schema;



const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

module.exports = mongoose.model("Campground",CampgroundSchema)