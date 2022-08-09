const {Schema} = require("mongoose");
const {Chat} = require("./Chat");
const {User} = require("./User");
const {ChatMember} = require("./ChatMember");
const {ChatInviteLink} = require("./ChatInviteLink");
module.exports = {
  ChatMemberUpdated: new Schema({
    chat: {type: Chat},
    from: {type: User},
    date: {type: Number},
    old_chat_member: {type: ChatMember},
    new_chat_member: {type: ChatMember},
    invite_link: {type: ChatInviteLink}
  })
}
