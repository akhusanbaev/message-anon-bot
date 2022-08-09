const {Schema} = require("mongoose");
module.exports = {
  VideoChatEnded: new Schema({
    duration: {type: Number}
  })
}
