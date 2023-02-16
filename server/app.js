const express = require("express")
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Joi = require("joi")
const multer = require('multer');
const router = express.Router()

const Article = require("./models/Article")
const Like = require("./models/Likes")
const Comment = require("./models/Comments")
const Query = require("./models/Query")
const Admin = require("./models/Admin")
const User = require("./models/User")

const adminAuth = require("./middleware/auth")
const userAuth = require("./middleware/cAuth")

// import { newComment } from "./controllers/Comments";

const { validateSignUp, validateLogIn } = require("./middleware/validator")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
//   }
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

// Get all articles
router.get("/articles", async (req, res) => {
	const articles = await Article.find().populate('comments')
	res.send(articles)
})

// Create an article
router.post("/articles", adminAuth, upload.single('image'), async (req, res) => {
 
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  // console.log(token)
  const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
  // console.log(decoded)
  const userId = decoded.user_id;
  // console.log(userId)

	const article = new Article ({
		title: req.body.title,
    image: {data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))},
		content: req.body.content,
    authorID: userId,
	})

	await article.save()
	res.send(article)

})

// Get individual article
router.get("/articles/:id", async (req, res) => {
	const article = await Article.findOne({ _id: req.params.id }).populate('comments')
	res.send(article)
})

// Update an article
router.patch("/articles/:id", adminAuth, async (req, res) => {
	try {
		const article = await Article.findOne({ _id: req.params.id })

		if (req.body.title) {
			article.title = req.body.title
		}

		if (req.body.content) {
			article.content = req.body.content
		}

		await article.save()
		res.send(article)
	} catch {
		res.status(404)
		res.send({ error: "Article doesn't exist!" })
	}
})

// Deleting an article
router.delete("/articles/:id", adminAuth, async (req, res) => {
	try {
		await Article.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Article doesn't exist!" })
	}
})

// Adding a comment to an article
router.post("/articles/:id/comments", userAuth, async (req, res) => {
  try {

    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
    const userId = decoded.user_id;
    
    const comment = new Comment({
      articleId: req.params.id,
      userId: userId,
      comment: req.body.comment,
    });

    const savedComment = await comment.save();

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: savedComment._id } },
      { new: true },
    ).populate('comments');

    res.json(article);

    // if(req.body.comment) {
    //   const comment = new Comment ({
    //     articleID: req.params.id,
    //     comment: req.body.comment,
    //     userID: userId,
    //   })

    //   await comment.save()
    //   res.send(comment)
    // }

	} catch {
		res.status(404)
		res.send({ error: "Article doesn't exist!" })
	}
})

// router.post("/comments", userAuth, async (req, res) => {
 
//   const token = req.body.token || req.query.token || req.headers["x-access-token"];
//   // console.log(token)
//   const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
//   // console.log(decoded)
//   const userId = decoded.user_id;
//   // console.log(userId)

// 	const comment = new Comment ({
// 		articleID: req.body.articleId,
//     comment: req.body.comment,
//     userID: userId,
// 	})

// 	await comment.save()
// 	res.send(comment)

// })

// Get all article comments
router.get("/articles/:id/comments", async (req, res) => {
	const article = await Article.findOne({ _id: req.params.id }).populate('comments')
	res.send(article.comments)
})

// Adding a like to an article
router.post("/articles/:id/likes", userAuth,async (req, res) => {
  try {

    const article = await Article.findOne({ _id: req.params.id })

    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(token)
    const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
    // console.log(decoded)
    const userId = decoded.user_id;
    // console.log(userId)

    if (req.body.like == true) {
      const like = {
        articleId: req.params.id,
        userId: userId,
        like: req.body.like,
      }

      await like.save()
      res.send(like)
    }
  }
  catch {
    res.status(404)
    res.send({ error: "Article doesn't exist!" })
  }
})

router.post("/likes", userAuth, async (req, res) => {
 
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  // console.log(token)
  const decoded = jsonwebtoken.verify(token, JWT_SECRET); 
  // console.log(decoded)
  const userId = decoded.user_id;
  // console.log(userId)

	const like = new Comment ({
		articleID: req.body.articleId,
    userID: userId,
	})

	await like.save()
	res.send(like)

})

// Create a Querry
router.post("/queries", async (req, res) => {
	const query = new Query ({
		name: req.body.name,
    email: req.body.email,
		message: req.body.message,
	})
	await query.save()
	res.send(query)
})

// Get all querries
router.get("/queries", adminAuth,async (req, res) => {
	const queries = await Query.find()
	res.send(queries)
})

// Add new admin user
router.post("/registerAdmin", async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      const {error, value} = validateSignUp(req.body);

      if (error) {
        console.log(error)
        return res.send(error.details)
        // res.status(400).send("All input is required");
      }

      const oldUser = await Admin.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      encryptedPassword = await bcrypt.hash(password, 10);

      const user = await Admin.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
});

// Admin login
router.post("/adminLogin", async (req, res) => {

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.send(error.details)
      // res.status(400).send("All input is required");
    }

    const user = await Admin.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

// Add new client user
router.post("/registerUser", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const {error, value} = validateSignUp(req.body)

    if (error) {
      console.log(error)
      return res.send(error.details)
      // res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// client login
router.post("/clientLogin", async (req, res) => {

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.send(error.details)
      // res.status(400).send("All input is required");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});


router.post("/welcome", adminAuth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});


module.exports = router