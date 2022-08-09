const {Schema} = require("mongoose");
module.exports = {
  ChatPhoto: new Schema({
    small_file_id: {type: String},
    small_file_unique_id: {type: String},
    big_file_id: {type: String},
    big_file_unique_id: {type: String}
  })
}
