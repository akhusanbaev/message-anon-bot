const {Schema} = require("mongoose");
module.exports = {
  PollOption: new Schema({
    text: {type: String},
    voter_count: {type: Number}
  })
}
