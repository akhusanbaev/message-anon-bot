const {Schema} = require("mongoose");
module.exports = {
  ResponseParameters: new Schema({
    migrate_to_chat_id: {type: Number},
    retry_after: {type: Number}
  })
}
