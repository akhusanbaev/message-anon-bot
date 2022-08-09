const {Schema} = require("mongoose");
module.exports = {
  PhotoSize: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    width: {type: Number},
    height: {type: Number},
    file_size: {type: Number}
  })
}
