const {Schema} = require("mongoose");
module.exports = {
  ChatPermissions: new Schema({
    can_send_messages: {type: Boolean},
    can_send_media_messages: {type: Boolean},
    can_send_polls: {type: Boolean},
    can_send_other_messages: {type: Boolean},
    can_add_web_page_previews: {type: Boolean},
    can_change_info: {type: Boolean},
    can_invite_users: {type: Boolean},
    can_pin_messages: {type: Boolean}
  })
}
