const {Schema} = require("mongoose");
module.exports = {
  PassportElementError: new Schema({
    source: {type: String},
    type: {type: String},
    field_name: {type: String},
    data_hash: {type: String},
    message: {type: String},
    file_hash: {type: String},
    file_hashes: {type: [String]},
    element_hash: {type: String}
  })
}
