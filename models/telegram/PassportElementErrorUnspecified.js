const {Schema} = require("mongoose");
module.exports = {
  PassportElementErrorUnspecified: new Schema({
    source: {type: String},
    type: {type: String},
    element_hash: {type: String},
    message: {type: String}
  })
}
