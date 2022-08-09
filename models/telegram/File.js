const {Schema} = require("mongoose");
module.exports = {
  File: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    file_size: {type: Number},
    file_path: {type: String}
  })
}
