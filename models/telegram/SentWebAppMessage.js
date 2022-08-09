const {Schema} = require("mongoose");
module.exports = {
  SentWebAppMessage: new Schema({
    inline_message_id: {type: String}
  })
}
