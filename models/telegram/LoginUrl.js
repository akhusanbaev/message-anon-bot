const {Schema} = require("mongoose");
module.exports = {
  LoginUrl: new Schema({
    url: {type: String},
    forward_text: {type: String},
    bot_username: {type: String},
    request_write_access: {type: String}
  })
}
