const {Schema} = require("mongoose");
module.exports = {
  UserWatchlist: new Schema({
    user: {type: String}, // Users._id
    content: {type: String}, // msg content
  })
}
