const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
module.exports = {
  UserProfilePhotos: new Schema({
    total_count: Number,
    photos: {type: [[PhotoSize]]}
  })
}
