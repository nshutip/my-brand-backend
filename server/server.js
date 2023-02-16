const express = require("express")
const mongoose = require("mongoose")
const routes = require("./app")
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET =
  "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

mongoose
	.connect("mongodb://localhost:27017/my-brand", 
	{ useNewUrlParser: true })
	.then(() => {
		console.log("Successfully connected to database");

		const app = express()
		app.use(express.json())

		app.use("/api", routes)

		app.listen(4000, () => {
			console.log("Server has started! API running on localhost:4000")
		})
	})
	.catch((error) => {
		console.log("database connection failed. exiting now...");
		console.error(error);
		process.exit(1);
	  });