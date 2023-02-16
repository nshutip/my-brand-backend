const Comment = require("../models/Comments")

module.exports.newComment = function(req,res,next) {
    if (req.method == 'POST') {

        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
        const userId = decoded.user_id;

        const comment = new Comment ({
            articleID: req.params.id,
            comment: req.body.comment,
            userID: userId,
        });

        comment.save( (err, user) => {
            if(err) return res.status(500).send(err);
            return res.status(200).json(comment);
        });
    }
};