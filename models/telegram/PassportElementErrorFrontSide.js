const {Schema} = require("mongoose");
module.exports = {
  PassportElementErrorFrontSide: new Schema({
    source: {type: String},
    type: {type: String},
    file_hash: {type: String},
    message: {type: String}
  })
}
