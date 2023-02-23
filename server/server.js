const express = require("express")
const mongoose = require("mongoose")
const routes = require("./app")
const jsonwebtoken = require("jsonwebtoken");
const swaggerUI = require("swagger-ui-express")
const swaggerDoc = require("./swagger")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

try {
	mongoose.connect("mongodb://localhost:27017/my-brand", { useNewUrlParser: true })
	.then(() => {
		console.log("Successfully connected to database");
	})
	.catch((error) => {
		console.log("database connection failed. exiting now...");
		console.error(error);
		process.exit(1);
	});

	const app = express()

	app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))

	app.use(express.json())


	app.use("/api", routes)
	app.use("*", (req, res) => {
		res.status(404).json({ error: "RESOURCE NOT FOUND" });
	});

	const server = app.listen(4000, () => {
		console.log("Server has started! API running on localhost:4000")
	})

	module.exports = server
} catch(error) {
	console.log(error)
}

