const {Schema} = require("mongoose");
const {ChatPhoto} = require("./ChatPhoto");
const {ChatPermissions} = require("./ChatPermissions");
const {ChatLocation} = require("./ChatLocation");
module.exports = {
  Chat: new Schema({
    id: {type: Number},
    type: {type: String},
    title: {type: String},
    username: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    photo: {type: ChatPhoto},
    bio: {type: String},
    has_private_forwards: {type: Boolean},
    join_to_send_messages: {type: Boolean},
    join_by_request: {type: Boolean},
    description: {type: String},
    invite_link: {type: String},
    pinned_message: {type: Object},
    permissions: {type: ChatPermissions},
    slow_mode_delay: {type: Number},
    message_auto_delete_time: {type: Number},
    has_protected_content: {type: Boolean},
    sticker_set_name: {type: String},
    can_set_sticker_set: {type: Boolean},
    linked_chat_id: {type: Number},
    location: {type: ChatLocation}
  })
}
