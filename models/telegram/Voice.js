const {Schema} = require("mongoose");
module.exports = {
  Voice: new Schema({
    file_id: {type: String},
    file_unique_id: {type: String},
    duration: {type: Number},
    mime_type: {type: String},
    file_size: {type: Number}
  }),

}
