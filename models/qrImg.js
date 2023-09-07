const mongoose = require("mongoose");

const qrImgScheme = mongoose.Schema({
  qrUrl: {
    type: String,
    required: true,
  },
  qrImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("qrImg", qrImgScheme);
