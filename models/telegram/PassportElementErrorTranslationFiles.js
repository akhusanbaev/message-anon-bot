const {Schema} = require("mongoose");
module.exports = {
  PassportElementErrorTranslationFiles: new Schema({
    source: {type: String},
    type: {type: String},
    file_hashes: {type: [String]},
    message: {type: String}
  })
}
