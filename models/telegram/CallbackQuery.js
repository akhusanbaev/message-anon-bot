const {Schema} = require("mongoose");
const {User} = require("./User");
const {Message} = require("./Message");
module.exports = {
  CallbackQuery: new Schema({
    id: {type: String},
    from: {type: User},
    message: {type: Message},
    inline_message_id: {type: String},
    chat_instance: {type: String},
    data: {type: String},
    game_short_name: {type: String}
  })
}
