const {Schema} = require("mongoose");
module.exports = {
  BotCommandScope: new Schema({
    type: {type: String},
    chat_id: {type: Number},
    user_id: {type: Number}
  }),
  BotCommandScopeDefault: new Schema({
    type: {type: String}, // default
  }),
  BotCommandScopeAllPrivateChats: new Schema({
    type: {type: String}, // all_private_chats
  }),
  BotCommandScopeAllGroupChats: new Schema({
    type: {type: String}, // all_group_chats
  }),
  BotCommandScopeAllChatAdministrators: new Schema({
    type: {type: String}, // all_chat_administrators
  }),
  BotCommandScopeChat: new Schema({
    type: {type: String}, // chat
    chat_id: {type: Number}
  }),
  BotCommandScopeChatAdministrators: new Schema({
    type: {type: String}, // chat_administrators
    chat_id: {type: Number}
  }),
  BotCommandScopeChatMember: new Schema({
    type: {type: String}, // chat_member
    chat_id: {type: Number},
    user_id: {type: Number}
  })
}
