const express = require("express")
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Joi = require("joi")
const multer = require('multer');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const router = express.Router()

const Article = require("./models/articleModel")
const Like = require("./models/likeModel")
const Comment = require("./models/commentModel")
const Query = require("./models/queryModel")
const Admin = require("./models/adminModel")
const User = require("./models/userModel")

const adminAuth = require("./middleware/auth")
const userAuth = require("./middleware/cAuth")

const { validateSignUp, validateLogIn, 
  validateArticle, validateComment, validateQuery, validateLike } = require("./middleware/validator")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Get all articles
router.get("/articles", async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'get all articles'
  // #swagger.summary = 'get all articles'

  try {
    const articles = await Article.find()
    return res.status(200).send(articles)
  } catch {
    res.status(404).send({ error: "Articles not found!" })
  }
})

// Create an article
router.post("/articles", adminAuth, upload.single('image'), async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'add new article'
  // #swagger.summary = 'add new article'
  /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

  try {
    const {error, value} = validateArticle(req.body);

    if (error) return res.status(400).send(error.details);

    const userId = await req.user._id;

    console.log(userId)
  
    const article = new Article ({
      title: req.body.title,
      image: req.file ? req.file.filename : undefined,
      content: req.body.content,
      authorId: userId,
    })
  
    await article.save()
    return res.status(200).send({message:"Article added successfuly", article})
  } catch (error){
    console.log(req.user)
    return res.status(500).json({ error: "Unsuccessfull request!" })
  }
})

// Get individual article
router.get("/articles/:id", async (req, res) => {
    // #swagger.tags = ['Articles']
    // #swagger.description = 'get a single article'
    // #swagger.summary = 'get a single article'

	const article = await Article.findOne({ _id: req.params.id }).populate('likes').populate('comments')
	return res.status(200).send(article)
})

// Update an article
router.patch("/articles/:id", adminAuth, async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'update an article'
  // #swagger.summary = 'update an article'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {
		const article = await Article.findOne({ _id: req.params.id })

		if (req.body.title) {
			article.title = req.body.title
		}

		if (req.body.content) {
			article.content = req.body.content
		}

    if (req.body.image) {
			article.image = req.body.image
		}

		await article.save()
		return res.status(200).send(article)
	} catch {
		return res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Deleting an article
router.delete("/articles/:id", adminAuth, async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'delete an article'
  // #swagger.summary = 'delete an article'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {
    const article = await Article.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "Article deleted successfuly"})
	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Adding a comment to an article
router.post("/articles/:id/comments", userAuth,async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'add comment to an article'
  // #swagger.summary = 'add comment to an article'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

  try {
    const {error, value} = validateComment(req.body);

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const userId = req.user._id;
    
    const comment = new Comment({
      articleId: req.params.id,
      userId: userId,
      comment: req.body.comment,
    });

    const savedComment = await comment.save();

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: savedComment._id } },
      // { new: true },
    ).populate('comments');

    return res.status(201).send({message: "Comment added successfuly", comment})

	} catch {
		res.status(400).send({ error: "failed to add comment!" })
	}
})

// Get all article comments
router.get("/articles/:id/comments", async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'get all article comments'
  // #swagger.summary = 'get all article comments'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	const article = await Article.findOne({ _id: req.params.id }).populate('comments')
	return res.status(200).send(article.comments)
})

// Delete a comment
router.delete("/articles/:id1/comments/:id2", userAuth, async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'delete a comment'
  // #swagger.summary = 'delete a comment'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {

    const userId = req.user._id;
    console.log(userId)

    const comment = await Comment.findOne({ _id: req.params.id2 })
    
    const comAuthor = comment.userId;
    console.log(comAuthor)

    if (userId.toString === comAuthor.toString) {
      await Comment.deleteOne({ _id: req.params.id2 })
      return res.status(200).send({message: "comment deleted successfuly"})
    } else {
      return res.status(403).send({error: "You do not have the permissions to delete this comment!"})
    }

	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Adding a like to an article
router.post("/articles/:id/likes", userAuth,async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'add a like to an article'
  // #swagger.summary = 'add a like to an article'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

  try {

    const {error, value} = validateLike();

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const articleId = req.params.id;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ articleId, userId });

    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this article!' });
    }

    const like = new Like({
      articleId,
      userId,
      like: true,
    });

    await like.save();

    await Article.updateOne({ _id: articleId }, { $push: { likes: like._id } });

    return res.status(201).json({ message: 'Article liked successfully', like });

  }
  catch {
    res.status(404).send({ error: "Article doesn't exist!" })
  }
})

// Get all article likes
router.get("/articles/:id/likes", async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'get all article likes'
  // #swagger.summary = 'get all article likes'

	const article = await Article.findOne({ _id: req.params.id }).populate('likes')
	return res.status(200).send(article.likes)
})

// Delete a like
router.delete("/articles/:id1/likes/:id2", userAuth, async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'delete a like'
  // #swagger.summary = 'delete a like'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {

    const like = await Like.findOne({ _id: req.params.id2 })

    const userId = req.user._id;

    const likeAuthor = like.userId

    if (userId === likeAuthor) {
      await Like.deleteOne({ _id: req.params.id2 })
      return res.status(204).send()
    } else {
      return res.status(403).send({error: "You do not have the permissions to remove this like!"})
    }
	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Create a Query
router.post("/queries", async (req, res) => {
  // #swagger.tags = ['Querries']
  // #swagger.description = 'create a query'
  // #swagger.summary = 'create a query'

  const {error, value} = validateQuery(req.body);

  if (error) {
    console.log(error)
    return res.status(400).send(error.details)
  }

  const { name, email, message } = req.body

	const query = new Query ({ name, email, message, })

	await query.save()

	return res.status(201).send({message: "Query sent successfuly", query})
})

// Get all queries
router.get("/queries", adminAuth,async (req, res) => {
  // #swagger.tags = ['Queries']
  // #swagger.description = 'get all queries'
  // #swagger.summary = 'get all queries'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	const queries = await Query.find()
	return res.status(200).send(queries)
})

// Add new admin user
router.post("/user/admin/signup", async (req, res) => {
  // #swagger.tags = ['Articles']
  // #swagger.description = 'add new admin user'
  // #swagger.summary = 'add new admin user'

  try {

    const {error, value} = validateSignUp(req.body);

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const { first_name, last_name, email, password } = req.body;

    const oldUser = await Admin.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return res.status(201).send({message:"Admin added successfully",user});

  } catch (err) {
    console.log(err);
  }
});

// Admin login
router.post("/user/admin/login", async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'admin login'
  // #swagger.summary = 'admin login'

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.status(400).send({message: 'Email and password are required', error: error.details});
    }

    const user = await Admin.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      return res.status(200).json({ message: 'Login successful', token });
      
    } else {
      return res.status(401).send({ message: 'Email or password is incorrect' });
    }
    
  } catch (err) {
    return res.status(500).json({error: "login request failed!"})
  }
});

// Get all admin users
router.get("/user/admin", adminAuth,async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'get all admin users'
  // #swagger.summary = 'get all admin users'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	const admin = await Admin.find()
	return res.status(200).send(admin)
})

// Update admin information
router.patch("/user/admin/:id", adminAuth, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'update admin information'
  // #swagger.summary = 'update admin information'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {
		const admin = await Admin.findOne({ _id: req.params.id })

		if (req.body.first_name) {
			admin.first_name = req.body.first_name
		}

		if (req.body.last_name) {
			admin.last_name = req.body.last_name
		}

    if (req.body.email) {
			admin.email = req.body.email
		}

		await admin.save()
		return res.status(200).send({message: "Admin information updated successfully", admin})
	} catch {
		return res.status(404).send({ error: "User not found!" })
	}
})

// Delete admin user
router.delete("/user/admin/:id", adminAuth, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'delete admin user'
  // #swagger.summary = 'delete admin user'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {
		await Admin.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "Admin user deleted successfully"})
	} catch {
		res.status(404).send({ error: "Admin user not found!" })
	}
})

// Get all client users
router.get("/user/client", adminAuth,async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'get all client users'
  // #swagger.summary = 'get all client users'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	const user = await User.find()
	return res.status(200).send(user)
})

// Delete client user
router.delete("/user/client/:id", adminAuth, async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'delete client user'
  // #swagger.summary = 'delete client user'
    /* #swagger.security = [{
    "apiKeyAuth": []
  }] */

	try {
		await User.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "User deleted successfully"})
	} catch {
		res.status(404).send({ error: "User not found!" })
	}
})

// Add new client user
router.post("/user/client/signup", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'add new client user'
  // #swagger.summary = 'add new client user'

  try {
    const { first_name, last_name, email, password } = req.body;

    const {error, value} = validateSignUp(req.body)

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return res.status(201).send({message: "User added successfully", user});

  } catch (err) {
    console.log(err);
  }
});

// client login
router.post("/user/client/login", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'user login'
  // #swagger.summary = 'user login'

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.status(400).send({message: 'Email and password are required', error: error.details});
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      return res.status(200).send({ message: 'Login successful', token });
    }
    return res.status(401).send({ message: 'Email or password is incorrect' });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router