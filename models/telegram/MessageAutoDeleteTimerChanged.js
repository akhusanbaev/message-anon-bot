const {Schema} = require("mongoose");
module.exports = {
  MessageAutoDeleteTimerChanged: new Schema({
    message_auto_delete_time: {type: Number}
  })
}
