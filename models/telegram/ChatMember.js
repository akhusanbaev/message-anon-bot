const {Schema} = require("mongoose");
const {User} = require("./User");
module.exports = {
  ChatMember: new Schema({
    status: {type: String},
    user: {type: User},
    is_anonymous: {type: Boolean},
    custom_title: {type: String},
    can_be_edited: {type: Boolean},
    can_manage_chat: {type: Boolean},
    can_delete_messages: {type: Boolean},
    can_manage_video_chats: {type: Boolean},
    can_restrict_members: {type: Boolean},
    can_promote_members: {type: Boolean},
    can_change_info: {type: Boolean},
    can_invite_users: {type: Boolean},
    can_post_messages: {type: Boolean},
    can_edit_messages: {type: Boolean},
    can_pin_messages: {type: Boolean},
    is_member: {type: Boolean},
    can_send_messages: {type: Boolean},
    can_send_media_messages: {type: Boolean},
    can_send_polls: {type: Boolean},
    can_send_other_messages: {type: Boolean},
    can_add_web_page_previews: {type: Boolean},
    until_date: {type: Number}
  }),
  ChatMemberOwner: new Schema({
    status: {type: String}, // creator
    user: {type: User},
    is_anonymous: {type: Boolean},
    custom_title: {type: String}
  }),
  ChatMemberAdministrator: new Schema({
    status: {type: String}, // administrator
    user: {type: User},
    can_be_edited: {type: Boolean},
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
    can_pin_messages: {type: Boolean},
    custom_title: {type: String}
  }),
  ChatMemberMember: new Schema({
    status: {type: String}, // member
    user: {type: User}
  }),
  ChatMemberRestricted: new Schema({
    status: {type: String}, // restricted
    user: {type: User},
    is_member: {type: Boolean},
    can_change_info: {type: Boolean},
    can_invite_users: {type: Boolean},
    can_pin_messages: {type: Boolean},
    can_send_messages: {type: Boolean},
    can_send_media_messages: {type: Boolean},
    can_send_polls: {type: Boolean},
    can_send_other_messages: {type: Boolean},
    can_add_web_page_previews: {type: Boolean},
    until_date: {type: Number}
  }),
  ChatMemberLeft: new Schema({
    status: {type: String}, // left
    user: {type: User}
  }),
  ChatMemberBanned: new Schema({
    status: {type: String}, // kicked
    user: {type: User},
    until_date: {type: Number}
  }),
}
