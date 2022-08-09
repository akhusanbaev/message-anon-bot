const {Schema} = require("mongoose");
module.exports = {
  VideoChatScheduled: new Schema({
    start_date: {type: Number}
  })
}
