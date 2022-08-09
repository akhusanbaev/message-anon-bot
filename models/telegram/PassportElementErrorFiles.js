const {Schema} = require("mongoose");
module.exports = {
  PassportElementErrorFiles: new Schema({
    source: {type: String},
    type: {type: String},
    file_hashes: {type: [String]},
    message: {type: String}
  })
}
