const {Schema} = require("mongoose");
const {PhotoSize} = require("./PhotoSize");
module.exports = {
  Document: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    thumb: {type: PhotoSize},
    file_name: {type: String},
    mime_type: {type: String},
    file_size: {type: Number}
  })
}
