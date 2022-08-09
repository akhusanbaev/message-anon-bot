const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
module.exports = {
  VideoNote: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    length: {type: Number},
    duration: {type: Number},
    thumb: {type: PhotoSize},
    file_size: {type: Number}
  })
}
