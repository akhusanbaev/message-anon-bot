const {Schema} = require("mongoose");
module.exports = {
  MessageId: new Schema({
    message_id: {type: Number}
  })
}
