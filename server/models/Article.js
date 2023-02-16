const mongoose = require("mongoose")
// const Comment = require("./Comments")
// const Like = require("./Likes")
// const Admin = require("./Admin")

const articleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: { data: Buffer },
	content: { type: String, required: true },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	authorId: { type: mongoose.Schema.Types.ObjectId,  ref: 'Admin' },
});

module.exports = mongoose.model("Article", articleSchema)
