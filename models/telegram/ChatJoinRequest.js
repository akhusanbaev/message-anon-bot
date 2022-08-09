const {Schema} = require("mongoose");
const {Chat} = require("./Chat");
const {User} = require("./User");
const {ChatInviteLink} = require("./ChatInviteLink");
module.exports = {
  ChatJoinRequest: new Schema({
    chat: {type: Chat},
    from: {type: User},
    date: {type: Number},
    bio: {type: String},
    invite_link: {type: ChatInviteLink}
  })
}
