const {Schema} = require("mongoose");
module.exports = {
  User: new Schema({
    id: {type: Number},
    is_bot: {type: Boolean},
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String},
    language_code: {type: String},
    is_premium: {type: Boolean},
    added_to_attachment_menu: {type: Boolean},
    can_join_groups: {type: Boolean},
    can_read_all_group_messages: {type: Boolean},
    supports_inline_queries: {type: Boolean}
  })
}
