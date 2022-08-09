const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
module.exports = {
  Audio: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    duration: {type: Number},
    performer: {type: String},
    title: {type: String},
    file_name: {type: String},
    mime_type: {type: String},
    file_size: {type: Number},
    thumb: {type: PhotoSize}
  })
}
