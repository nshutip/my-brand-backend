const mongoose = require("mongoose")
// const Article = require("./Article")
// const User = require("./User")

const schema = mongoose.Schema({
	articleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    },
	userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    like: Boolean,
})

module.exports = mongoose.model("Like", schema, "like")
