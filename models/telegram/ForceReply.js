const {Schema} = require("mongoose");
module.exports = {
  ForceReply: new Schema({
    force_reply: {type: Boolean},
    input_field_placeholder: {type: String},
    selective: {type: Boolean}
  })
}
