const mongoose = require("mongoose");

const shortId = require("shortid");

const shortUrlScheme = mongoose.Schema({
  userKey: {
    type: String,
    required: true,
  },
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  qrImage: {
    type: String,
    required: true,
    default:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tldr-link.onrender.com/",
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  customization: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlScheme);
