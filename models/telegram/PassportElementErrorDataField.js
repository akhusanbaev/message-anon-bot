const {Schema} = require("mongoose");
module.exports = {
  PassportElementErrorDataField: new Schema({
    source: {type: String},
    type: {type: String},
    field_name: {type: String},
    data_hash: {type: String},
    message: {type: String}
  })
}
