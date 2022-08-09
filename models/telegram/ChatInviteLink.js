const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  ChatInviteLink: new Schema({
    invite_link: {type: String},
    creator: {type: User},
    creates_join_request: {type: Boolean},
    is_primary: {type: Boolean},
    is_revoked: {type: Boolean},
    name: {type: String},
    expire_date: {type: Number},
    member_limit: {type: Number},
    pending_join_request_count: {type: Number}
  })
}
