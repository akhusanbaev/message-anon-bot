const {Schema} = require("mongoose");
module.exports = {
  ChatAdministratorRights: new Schema({
    is_anonymous: {type: Boolean},
    can_manage_chat: {type: Boolean},
    can_delete_messages: {type: Boolean},
    can_manage_video_chats: {type: Boolean},
    can_restrict_members: {type: Boolean},
    can_promote_members: {type: Boolean},
    can_change_info: {type: Boolean},
    can_invite_users: {type: Boolean},
    can_post_messages: {type: Boolean},
    can_edit_messages: {type: Boolean},
    can_pin_messages: {type: Boolean}
  })
}
