const express = require("express");
const app = express();

const ShortUrl = require("./models/shortUrl");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT, {
      dbName: "tldr-links",
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit();
  }
};
connectDB();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let token = "";

app.post("/authenticate", (req, res) => {
  const payload = {
    key: Date.now().toString(),
  };
  token = jwt.sign(payload, secretKey);
  console.log(token);
  res.json({ token });
});

//load the website and the url codes
app.get("/", async (req, res) => {
  res.render("index");
});

//return the user's links based on the key
app.get("/api/shortened-links", async (req, res) => {
  const userKey = req.query.userKey; // Retrieve the user's key from the query parameters

  // Fetch the user's shortened links from the database based on userKey
  const userShortenedLinks = await ShortUrl.find({ userKey: userKey });

  // Send the user's shortened links as a JSON response
  res.json(userShortenedLinks);
});

//create a short link and save it in the database
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({
    userKey: req.body.key,
    full: req.body.full,
  });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000, () => console.log("Running"));
