const {Schema} = require("mongoose");
module.exports = {
  PassportFile: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    file_size: {type: String},
    file_date: {type: String}
  })
}
