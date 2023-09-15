// Import required modules and set up environment variables
const express = require("express");
const app = express();

const ShortUrl = require("./models/shortUrl");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

// Import the connectDB function
const connectDB = require("./conn.js");

// Call the connectDB function to establish the database connection
connectDB();

// Set view engine, configure middleware, and initialize token variable
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let token = "";

// Define routes and their functionality

/**
 * Generate a json web token for the user's browser
 * @returns {string} - A web token in JSON format
 */
app.post("/authenticate", (req, res) => {
  const payload = {
    key: Date.now().toString(),
  };

  token = jwt.sign(payload, secretKey);

  res.json({ token });
});

/**
 * Render the main site (index.ejs)
 */
app.get("/", async (req, res) => {
  res.render("index");
});

/**
 * Fetch the user's shortened links from the database based on userKey
 * @returns {string} - user's shortened links in JSON format
 */
app.get("/api/shortened-links", async (req, res) => {
  // Retrieve the user's key from the query parameters
  const userKey = req.query.userKey;

  const userShortenedLinks = await ShortUrl.find({ userKey: userKey });

  res.json(userShortenedLinks);
});

/**
 * Create and save in db a short link using userKey (json web token) and full url
 */
app.post("/shortUrls", async (req, res) => {
  if (req.body.trimmedCustomization == "") {
    await ShortUrl.create({
      userKey: req.body.key,
      full: req.body.full,
    });

    res.json("ok");
  } else {
    const existingCustomizations = await ShortUrl.find({
      customization: req.body.trimmedCustomization,
    });

    if (existingCustomizations.length != 0) {
      res.json("not ok");
    } else {
      await ShortUrl.create({
        userKey: req.body.key,
        full: req.body.full,
        short: req.body.trimmedCustomization,
        customization: req.body.trimmedCustomization,
      });

      res.json("ok");
    }
  }
});

/**
 * Redirect a user using a short link to the proper website
 */
app.get("/:shortUrl", async (req, res) => {
  // find the url based on the short url in the link's parameters
  const requestedUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  // if the url doesn't exist send a 404 status
  if (requestedUrl == null) {
    return res.sendStatus(404);
  }

  // Increment the number of visits on the website by one
  requestedUrl.clicks++;
  requestedUrl.save();

  res.redirect(requestedUrl.full);
});

// Listen on the specified port or 5000
app.listen(process.env.PORT || 5000, () => console.log("Running"));
