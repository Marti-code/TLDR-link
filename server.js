const express = require("express");
const app = express();

const ShortUrl = require("./models/shortUrl");
const QrImg = require("./models/qrImg");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  const qrImages = await QrImg.find();
  res.render("index", { shortUrls: shortUrls, qrImages: qrImages });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl,
  });

  await QrImg.create({
    qrUrl: req.body.fullUrl,
    qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${req.body.fullUrl}`,
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

app.listen(process.env.PORT || 5000);
